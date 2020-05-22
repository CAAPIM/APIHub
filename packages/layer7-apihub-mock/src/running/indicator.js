// Inspired by NextJs
// https://github.com/zeit/next.js/blob/886037b1bac4bdbfeb689b032c1612750fb593f7/packages/next/client/dev/prerender-indicator.js#L1

import { iconQuestionMark } from './icons';

export const KEY = '@layer7/mock-server/running-indicator';
export const LINK =
    'https://github.com/marmelab/broadcom-api-hub/blob/master/packages/layer7-apihub-mock/README.md';

/**
 * Create and display the running indicator that should be displayed when the mock server is running.
 *
 * @param {*} icon The HTML element containing the icon
 * @param {*} link The link to open when clicking on the running indicator
 */
export function initializeRunningIndicator(
    icon = iconQuestionMark,
    link = LINK
) {
    const shadowHost = document.createElement('div');
    shadowHost.id = KEY;
    // Make sure container is fixed and on a high zIndex so it shows
    shadowHost.style.position = 'fixed';
    shadowHost.style.bottom = '20px';
    shadowHost.style.left = '10px';
    shadowHost.style.width = 0;
    shadowHost.style.height = 0;
    shadowHost.style.zIndex = 99998;
    shadowHost.style.transition = 'all 100ms ease';

    document.body.appendChild(shadowHost);

    let shadowRoot;
    let prefix = '';

    if (shadowHost.attachShadow) {
        shadowRoot = shadowHost.attachShadow({ mode: 'open' });
    } else {
        // If attachShadow is undefined then the browser does not support
        // the Shadow DOM, we need to prefix all the names so there
        // will be no conflicts
        shadowRoot = shadowHost;
        prefix = `${KEY}-`;
    }

    // Container
    const container = createContainer(prefix, icon, link);
    shadowRoot.appendChild(container);

    // CSS
    const css = createCss(prefix);
    shadowRoot.appendChild(css);

    const expandEl = container.querySelector('a');
    const closeEl = container.querySelector(`#${prefix}close`);

    // State
    const dismissKey = KEY;
    const dismissUntil = parseInt(window.localStorage.getItem(dismissKey), 10);
    const dismissed = dismissUntil > new Date().getTime();

    let isVisible = !dismissed;

    function updateContainer() {
        if (isVisible) {
            container.classList.add(`${prefix}visible`);
        } else {
            container.classList.remove(`${prefix}visible`);
        }
    }
    const expandedClass = `${prefix}expanded`;
    let toggleTimeout;

    const toggleExpand = (expand = true) => {
        clearTimeout(toggleTimeout);

        toggleTimeout = setTimeout(() => {
            if (expand) {
                expandEl.classList.add(expandedClass);
                closeEl.style.display = 'flex';
            } else {
                expandEl.classList.remove(expandedClass);
                closeEl.style.display = 'none';
            }
        }, 50);
    };

    closeEl.addEventListener('click', () => {
        const oneHourAway = new Date().getTime() + 1 * 60 * 60 * 1000;
        window.localStorage.setItem(dismissKey, oneHourAway + '');
        isVisible = false;
        updateContainer();
    });
    closeEl.addEventListener('mouseenter', () => toggleExpand());
    closeEl.addEventListener('mouseleave', () => toggleExpand(false));
    expandEl.addEventListener('mouseenter', () => toggleExpand());
    expandEl.addEventListener('mouseleave', () => toggleExpand(false));

    updateContainer();
}

function createContainer(prefix, icon, link) {
    const container = document.createElement('div');
    container.id = `${prefix}container`;

    container.innerHTML = `
      <button id="${prefix}close" title="Hide Running Indicator">
        <span>×</span>
      </button>
      <a href="${link}" target="_blank" rel="noreferrer">
        <div id="${prefix}icon-wrapper">
            ${icon}
            Mock Server Running
        </div>
        </a>
    `;

    return container;
}

function createCss(prefix) {
    const css = document.createElement('style');
    css.textContent = `
      #${prefix}container {
        position: absolute;
        display: none;
        bottom: 15px;
        left: 15px;
      }
      #${prefix}close {
        top: -10px;
        left: -10px;
        border: none;
        width: 18px;
        height: 18px;
        color: #333333;
        font-size: 16px;
        cursor: pointer;
        display: none;
        position: absolute;
        background: #ffffff;
        border-radius: 100%;
        align-items: center;
        flex-direction: column;
        justify-content: center;
      }
      #${prefix}container a {
        color: inherit;
        text-decoration: none;
        width: 40px;
        height: 50px;
        overflow: hidden;
        border-radius: 5px;
        background: #fff;
        color: #000;
        font: initial;
        cursor: pointer;
        letter-spacing: initial;
        text-shadow: initial;
        text-transform: initial;
        visibility: initial;
        font-size: 14px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        padding: 5px 8px;
        align-items: center;
        box-shadow: 0 11px 40px 0 rgba(0, 0, 0, 0.25), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
        display: flex;
        transition: opacity 0.1s ease, bottom 0.1s ease, width 0.3s ease;
        animation: ${prefix}fade-in 0.1s ease-in-out;
      }
      #${prefix}icon-wrapper {
        width: 140px;
        height: 50px;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        position: relative;
      }
      #${prefix}icon-wrapper svg {
        flex-shrink: 0;
        margin-right: 8px;
      }
      #${prefix}container a.${prefix}expanded {
        width: 135px;
      }
      #${prefix}container.${prefix}visible {
        display: flex;
        bottom: 10px;
        opacity: 1;
      }
      @keyframes ${prefix}fade-in {
        from {
          bottom: 0px;
          opacity: 0;
        }
        to {
          bottom: 10px;
          opacity: 1;
        }
      }
    `;

    return css;
}
