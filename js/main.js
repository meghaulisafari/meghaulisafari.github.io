/* ==========================================================================
   Hotel Meghauli Safari — shared site script
   Plain vanilla JS, no modules, no dependencies. One file serves every page;
   each block is feature-guarded and exits quietly when its markup is absent.

   Every value below traces back to meghauli-safari.json. Nothing invented.
   ========================================================================== */
(function() {
    "use strict";

    /* ------------------------------------------------------------------------
       Constants from meghauli-safari.json
       ------------------------------------------------------------------------ */

    var HOTEL_NAME = "Hotel Meghauli Safari";

    // contact.whatsapp — digits only, no plus, exactly what wa.me needs
    var WHATSAPP = "9779855014822";

    // contact.phones
    var PHONES = ["+9779855014822", "+9779766848382"];

    // contact.email
    var EMAIL = "meghaulisafari@gmail.com";

    // pricing.tax_included = false, so this rides alongside every price
    var TAX_NOTE = "+ applicable VAT and service charge";

    // pricing.display_currency
    var CURRENCY = "NPR";

    // booking.reference_prefix
    var REF_PREFIX = "HMS";

    // rooms[] — name and nightly rate, pre-tax
    var ROOMS = [
        { name: "Deluxe Room (Double / Triple / Family)", price: 4000 },
        { name: "Standard AC Room", price: 2500 },
        { name: "Non-AC Room", price: 1500 }
    ];

    // Replaced at deploy time. See BUILD_NOTES.md.
    var ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbwNe7Ok-FqDV0EGQWP9_IgdhZyRmybEx53-9FUp_a_PvlKk0jjUb_XZ68AeNvbfBXk2/exec";

    /* ------------------------------------------------------------------------
       Small helpers
       ------------------------------------------------------------------------ */

    function $(selector, root) {
        return (root || document).querySelector(selector);
    }

    function $$(selector, root) {
        return Array.prototype.slice.call(
            (root || document).querySelectorAll(selector)
        );
    }

    function formatMoney(amount) {
        return CURRENCY + " " + Number(amount).toLocaleString("en-US");
    }

    function pad(number) {
        return number < 10 ? "0" + number : String(number);
    }

    /* ------------------------------------------------------------------------
       WhatsApp helper — builds https://wa.me/<number>?text=<encoded>
       ------------------------------------------------------------------------ */

    function waLink(message) {
        return (
            "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message || "")
        );
    }

    /* Floating button on every page. The prefill is page-specific: pages declare
       their context with data-wa-context on <body>, room pages add data-wa-room. */
    function initFloatingWhatsApp() {
        var float = $(".wa-float");
        if (!float) return;

        var body = document.body;
        var context = body.getAttribute("data-wa-context") || "";
        var room = body.getAttribute("data-wa-room") || "";

        var message = "Hello " + HOTEL_NAME + ", ";
        if (room) {
            message += "I would like to ask about the " + room + ".";
        } else if (context) {
            message += context;
        } else {
            message += "I have a question about staying with you.";
        }

        float.setAttribute("href", waLink(message));
    }

    /* ------------------------------------------------------------------------
       Mobile navigation
       ------------------------------------------------------------------------ */

    function initNav() {
        var toggle = $(".nav-toggle");
        var nav = $("#site-nav");
        if (!toggle || !nav) return;

        toggle.addEventListener("click", function() {
            var open = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });

        // Close on Escape so keyboard users are never trapped in the panel
        document.addEventListener("keydown", function(event) {
            if (event.key === "Escape" && nav.classList.contains("is-open")) {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
                toggle.focus();
            }
        });
    }

    /* ------------------------------------------------------------------------
       Click-to-load map (location.html)
       Nothing is requested from Google until the guest asks for the map.
       ------------------------------------------------------------------------ */

    function initMap() {
        var container = $("[data-map]");
        if (!container) return;

        var cover = $(".map-embed__cover", container);
        if (!cover) return;

        cover.addEventListener("click", function() {
            var src = container.getAttribute("data-map-src");
            if (!src) return;

            var frame = document.createElement("iframe");
            frame.setAttribute("src", src);
            frame.setAttribute("title", "Map showing the approximate location of " + HOTEL_NAME + " in Meghauli, Chitwan");
            frame.setAttribute("loading", "lazy");
            frame.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
            frame.setAttribute("allowfullscreen", "");

            container.innerHTML = "";
            container.appendChild(frame);
        });
    }

    /* ------------------------------------------------------------------------
       Gallery lightbox (gallery.html)
       ------------------------------------------------------------------------ */

    function initLightbox() {
        var lightbox = $("#lightbox");
        var triggers = $$("[data-lightbox]");
        if (!lightbox || !triggers.length) return;

        var image = $("#lightbox-image", lightbox);
        var caption = $("#lightbox-caption", lightbox);
        var closeButton = $(".lightbox__close", lightbox);
        var lastFocused = null;

        function open(trigger) {
            var thumb = $("img", trigger);
            if (!thumb) return;

            lastFocused = trigger;
            image.setAttribute("src", thumb.getAttribute("src"));
            image.setAttribute("alt", thumb.getAttribute("alt") || "");
            caption.textContent = trigger.getAttribute("data-caption") || "";
            lightbox.hidden = false;
            closeButton.focus();
        }

        function close() {
            lightbox.hidden = true;
            image.removeAttribute("src");
            if (lastFocused) lastFocused.focus();
        }

        triggers.forEach(function(trigger) {
            trigger.addEventListener("click", function() {
                open(trigger);
            });
        });

        closeButton.addEventListener("click", close);

        lightbox.addEventListener("click", function(event) {
            if (event.target === lightbox) close();
        });

        document.addEventListener("keydown", function(event) {
            if (lightbox.hidden) return;

            if (event.key === "Escape") {
                close();
                return;
            }

            // Focus trap: the dialog has exactly one focusable control, so keep Tab
            // on it rather than letting focus escape to the page behind.
            if (event.key === "Tab") {
                event.preventDefault();
                closeButton.focus();
            }
        });
    }

    /* ------------------------------------------------------------------------
       Booking request form (book.html)
       booking.level = "booking_request" — this collects a request and hands it
       to reception. It is not a reservation and takes no payment.
       ------------------------------------------------------------------------ */

    function initBookingForm() {
        var form = $("#booking-form");
        if (!form) return;

        var checkIn = $("#check-in", form);
        var checkOut = $("#check-out", form);
        var adults = $("#adults", form);
        var children = $("#children", form);
        var childAgesWrap = $("#child-ages", form);
        var roomType = $("#room-type", form);
        var roomCount = $("#room-count", form);
        var submitButton = $("#submit-button", form);
        var errorBox = $("#form-error");
        var formPanel = $("#form-panel");
        var confirmationPanel = $("#confirmation-panel");
        var whatsappInstead = $("#whatsapp-instead");
        var dateError = $("#check-out-error");

        var nightsOut = $("#nights-value");
        var estimateRoomOut = $("#estimate-room");
        var estimateNightsOut = $("#estimate-nights");
        var estimateRoomsOut = $("#estimate-rooms");
        var estimateTotalOut = $("#estimate-total");
        var estimateDetail = $("#estimate-detail");
        var estimateUnknown = $("#estimate-unknown");

        var submitting = false;

        /* --- Dates ---------------------------------------------------------- */

        function today() {
            var now = new Date();
            return (
                now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate())
            );
        }

        checkIn.min = today();
        checkOut.min = today();

        function nights() {
            if (!checkIn.value || !checkOut.value) return 0;
            var start = new Date(checkIn.value + "T00:00:00");
            var end = new Date(checkOut.value + "T00:00:00");
            var diff = Math.round((end - start) / 86400000);
            return diff > 0 ? diff : 0;
        }

        function validateDates() {
            // Checkout must be after check-in. Enforced with min= and again here,
            // because min= alone is not reliable on every mobile date picker.
            if (checkIn.value) {
                var next = new Date(checkIn.value + "T00:00:00");
                next.setDate(next.getDate() + 1);
                checkOut.min =
                    next.getFullYear() + "-" + pad(next.getMonth() + 1) + "-" + pad(next.getDate());
            }

            var bad =
                checkIn.value && checkOut.value && nights() === 0;

            checkOut.setAttribute("aria-invalid", bad ? "true" : "false");
            dateError.textContent = bad
                ? "Check-out must be at least one night after check-in."
                : "";
            checkOut.setCustomValidity(
                bad ? "Check-out must be after check-in." : ""
            );

            return !bad;
        }

        /* --- Children ages -------------------------------------------------- */

        function syncChildAges() {
            var count = parseInt(children.value, 10) || 0;
            var existing = $$("input[name^='child_age_']", childAgesWrap);

            if (count === existing.length) return;

            childAgesWrap.innerHTML = "";
            childAgesWrap.hidden = count === 0;

            for (var i = 1; i <= count; i++) {
                var wrapper = document.createElement("div");

                var label = document.createElement("label");
                label.setAttribute("for", "child-age-" + i);
                label.textContent = "Age of child " + i;

                var input = document.createElement("input");
                input.type = "number";
                input.id = "child-age-" + i;
                input.name = "child_age_" + i;
                input.min = "0";
                input.max = "17";
                input.inputMode = "numeric";

                wrapper.appendChild(label);
                wrapper.appendChild(input);
                childAgesWrap.appendChild(wrapper);
            }
        }

        /* --- Estimate -------------------------------------------------------
           Room rate x rooms x nights. An estimate to be confirmed by reception,
           never a charge. pricing.foreign_guest_pricing is "same", so nationality
           is collected for the owner but does not change the figure — the panel
           says so rather than leaving the guest to wonder.
           ------------------------------------------------------------------- */

        function selectedRoom() {
            var value = roomType.value;
            for (var i = 0; i < ROOMS.length; i++) {
                if (ROOMS[i].name === value) return ROOMS[i];
            }
            return null;
        }

        function updateEstimate() {
            var count = nights();
            nightsOut.textContent = count
                ? count + (count === 1 ? " night" : " nights")
                : "—";

            var room = selectedRoom();
            var rooms = parseInt(roomCount.value, 10) || 1;

            // "Not sure — please suggest" has no rate, so show no number at all
            // rather than a misleading one.
            if (!room || !count) {
                estimateDetail.hidden = true;
                estimateUnknown.hidden = false;
                return;
            }

            estimateDetail.hidden = false;
            estimateUnknown.hidden = true;

            estimateRoomOut.textContent = room.name + " — " + formatMoney(room.price) + " per night";
            estimateNightsOut.textContent = count + (count === 1 ? " night" : " nights");
            estimateRoomsOut.textContent = rooms + (rooms === 1 ? " room" : " rooms");
            estimateTotalOut.textContent = formatMoney(room.price * rooms * count);
        }

        function refresh() {
            validateDates();
            syncChildAges();
            updateEstimate();
        }

        ["change", "input"].forEach(function(eventName) {
            form.addEventListener(eventName, function(event) {
                var target = event.target;
                if (
                    target === checkIn ||
                    target === checkOut ||
                    target === children ||
                    target === roomType ||
                    target === roomCount
                ) {
                    refresh();
                }
            });
        });

        refresh();

        /* --- Payload -------------------------------------------------------- */

        function collect() {
            var data = new FormData(form);
            var payload = {};

            data.forEach(function(value, key) {
                if (key === "activities") {
                    payload.activities = payload.activities || [];
                    payload.activities.push(value);
                } else {
                    payload[key] = typeof value === "string" ? value.trim() : value;
                }
            });

            payload.activities = (payload.activities || []).join(", ");
            payload.nights = nights();

            var room = selectedRoom();
            var rooms = parseInt(roomCount.value, 10) || 1;
            payload.estimate =
                room && nights()
                    ? formatMoney(room.price * rooms * nights()) + " " + TAX_NOTE
                    : "Not calculated — room type to be suggested";

            return payload;
        }

        function reference() {
            var now = new Date();
            var stamp =
                now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate());
            var suffix = "";
            var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            for (var i = 0; i < 4; i++) {
                suffix += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            }
            return REF_PREFIX + "-" + stamp + "-" + suffix;
        }

        /* Human-readable version of the request, used for both WhatsApp paths. */
        function asMessage(payload) {
            var lines = [
                "Booking request for " + HOTEL_NAME,
                "",
                "Name: " + (payload.name || ""),
                "Phone / WhatsApp: " + (payload.phone || ""),
                "Email: " + (payload.email || ""),
                "Check-in: " + (payload.check_in || ""),
                "Check-out: " + (payload.check_out || ""),
                "Nights: " + payload.nights,
                "Adults: " + (payload.adults || ""),
                "Children: " + (payload.children || "0")
            ];

            for (var i = 1; i <= 6; i++) {
                if (payload["child_age_" + i]) {
                    lines.push("  Child " + i + " age: " + payload["child_age_" + i]);
                }
            }

            lines.push("Room type: " + (payload.room_type || ""));
            lines.push("Number of rooms: " + (payload.room_count || ""));
            lines.push("Nationality: " + (payload.nationality || ""));

            if (payload.activities) {
                lines.push("Interested in: " + payload.activities);
            }
            if (payload.message) {
                lines.push("Message: " + payload.message);
            }

            lines.push("");
            lines.push("Estimate: " + payload.estimate);

            return lines.join("\n");
        }

        /* --- "Send on WhatsApp instead" — same data, no backend -------------- */

        if (whatsappInstead) {
            whatsappInstead.addEventListener("click", function() {
                if (!form.reportValidity()) return;
                if ($("#company", form).value) return; // honeypot
                window.open(waLink(asMessage(collect())), "_blank", "noopener");
            });
        }

        /* --- Turnstile ------------------------------------------------------
           The widget only renders once a real site key replaces the placeholder.
           Gating on a token only when the widget actually rendered keeps the form
           testable before deployment and protected after it.
           ------------------------------------------------------------------- */

        function turnstileToken() {
            var field = form.querySelector("[name='cf-turnstile-response']");
            return field ? field.value : "";
        }

        function turnstileActive() {
            return !!form.querySelector("[name='cf-turnstile-response']");
        }

        /* --- Submit --------------------------------------------------------- */

        function showFailure(payload) {
            var link = $("#wa-fallback-link", errorBox);
            if (link) link.setAttribute("href", waLink(asMessage(payload)));
            errorBox.hidden = false;
            errorBox.setAttribute("tabindex", "-1");
            errorBox.focus();
        }

        function showConfirmation(ref) {
            var refOut = $("#confirmation-reference", confirmationPanel);
            var waButton = $("#confirmation-whatsapp", confirmationPanel);

            if (refOut) refOut.textContent = ref;
            if (waButton) {
                waButton.setAttribute(
                    "href",
                    waLink(
                        "Hello " +
                        HOTEL_NAME +
                        ", I have just sent a booking request. My reference is " +
                        ref +
                        "."
                    )
                );
            }

            formPanel.hidden = true;
            confirmationPanel.hidden = false;
            confirmationPanel.setAttribute("tabindex", "-1");
            confirmationPanel.focus();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        form.addEventListener("submit", function(event) {
            event.preventDefault();

            if (submitting) return; // no double submit
            if (!validateDates()) {
                form.reportValidity();
                return;
            }
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Honeypot: a real guest never fills a field they cannot see.
            // Fail silently — telling a bot why it was rejected only helps it.
            if ($("#company", form).value) {
                showConfirmation(reference());
                return;
            }

            if (turnstileActive() && !turnstileToken()) {
                errorBox.hidden = false;
                return;
            }

            var payload = collect();
            payload.reference = reference();
            payload.submitted_at = new Date().toISOString();
            payload.turnstile_token = turnstileToken();

            submitting = true;
            errorBox.hidden = true;
            submitButton.disabled = true;
            submitButton.innerHTML =
                '<span class="spinner" aria-hidden="true"></span> Sending your request…';

            fetch(ENDPOINT_URL, {
                method: "POST",
                // text/plain avoids a CORS preflight against Apps Script, which does
                // not return Access-Control-Allow-Headers for application/json.
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            })
                .then(function(response) {
                    return response.json();
                })
                .then(function(result) {
                    if (result && result.ok) {
                        showConfirmation(result.reference || payload.reference);
                    } else {
                        throw new Error((result && result.error) || "Request failed");
                    }
                })
                .catch(function() {
                    // Never lose the guest: hand them WhatsApp, phone and email.
                    submitting = false;
                    submitButton.disabled = false;
                    submitButton.textContent = "Send booking request";
                    showFailure(payload);
                });
        });
    }

    /* ------------------------------------------------------------------------
       Boot
       ------------------------------------------------------------------------ */

    function init() {
        initNav();
        initFloatingWhatsApp();
        initMap();
        initLightbox();
        initBookingForm();

        var year = $("#current-year");
        if (year) year.textContent = new Date().getFullYear();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Exposed only so page-level markup can build contextual links if needed.
    window.HMS = { waLink: waLink, phones: PHONES, email: EMAIL };
})();
