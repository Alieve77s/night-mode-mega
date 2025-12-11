// ==UserScript==
// @name         Ultra Dark Mode (Safari Safe)
// @namespace    https://example.com
// @version      3.0
// @description  Universal dark mode layer compatible with Safari
// @author       ali
// @match        *://*/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    "use strict";

    const defaultOpacity = GM_getValue("opacity", 35);
    const enabled = GM_getValue("enabled", true);

    // Create dark layer early
    const layer = document.createElement("div");
    layer.id = "darkmode-layer";

    GM_addStyle(`
        #darkmode-layer {
            pointer-events: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgb(0,0,0) !important;
            opacity: ${enabled ? defaultOpacity : 0}% !important;
            z-index: 2147483646 !important;
        }

        #darkmode-toggle {
            position: fixed !important;
            bottom: 15px !important;
            right: 15px !important;
            width: 42px !important;
            height: 42px !important;
            background: #000 !important;
            border: 2px solid #fff !important;
            border-radius: 10px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: white !important;
            font-size: 22px !important;
            cursor: pointer !important;
            z-index: 2147483647 !important;
        }

        #darkmode-panel {
            position: fixed !important;
            bottom: 70px !important;
            right: 15px !important;
            background: rgba(0,0,0,0.85) !important;
            border: 1px solid white !important;
            padding: 12px !important;
            color: white !important;
            border-radius: 10px !important;
            display: none !important;
            z-index: 2147483647 !important;
            font-family: sans-serif !important;
        }
    `);

    document.documentElement.appendChild(layer);

    // Toggle UI button
    const toggle = document.createElement("div");
    toggle.id = "darkmode-toggle";
    toggle.textContent = "🌙";
    document.documentElement.appendChild(toggle);

    // Settings panel
    const panel = document.createElement("div");
    panel.id = "darkmode-panel";
    panel.innerHTML = `
        <label>Opacity: <span id="opacityVal">${defaultOpacity}</span>%</label>
        <input id="opacitySlider" type="range" min="0" max="95" value="${defaultOpacity}" style="width:140px"><br><br>
        <label><input id="enableToggle" type="checkbox" ${enabled ? "checked" : ""}> Enable dark mode</label>
    `;
    document.documentElement.appendChild(panel);

    // Events
    toggle.onclick = () => {
        panel.style.display = panel.style.display === "block" ? "none" : "block";
    };

    document.getElementById("opacitySlider").oninput = e => {
        const val = e.target.value;
        document.getElementById("opacityVal").innerText = val;
        layer.style.opacity = val + "%";
        GM_setValue("opacity", val);
    };

    document.getElementById("enableToggle").onchange = e => {
        const isOn = e.target.checked;
        layer.style.opacity = isOn ? GM_getValue("opacity", 35) + "%" : "0%";
        GM_setValue("enabled", isOn);
    };

    // Hide UI in fullscreen videos
    document.addEventListener("fullscreenchange", () => {
        toggle.style.display = document.fullscreenElement ? "none" : "flex";
        panel.style.display = "none";
    });
})();
