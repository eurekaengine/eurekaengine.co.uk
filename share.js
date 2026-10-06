(function () {
    var canonical = document.querySelector('link[rel="canonical"]');
    var url = canonical ? canonical.href : window.location.href.split('#')[0];
    var title = (document.querySelector('h1') || document.querySelector('title') || {}).textContent || document.title;
    title = title.trim();
    var u = encodeURIComponent(url);
    var t = encodeURIComponent(title);

    var icons = {
        x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
        linkedin: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452z"/>',
        facebook: '<path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.514c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>',
        email: '<path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm16 3.2-8 5-8-5V17h16z"/>',
        link: '<path d="M10.6 13.4a1 1 0 0 1 0-1.4l3-3a3 3 0 1 1 4.2 4.2l-1.5 1.5-1.4-1.4 1.5-1.5a1 1 0 0 0-1.4-1.4l-3 3a1 1 0 0 1-1.4 0zm2.8-2.8a1 1 0 0 1 0 1.4l-3 3a3 3 0 1 1-4.2-4.2l1.5-1.5 1.4 1.4-1.5 1.5a1 1 0 0 0 1.4 1.4l3-3a1 1 0 0 1 1.4 0z"/>',
        share: '<path d="M18 16a3 3 0 0 0-2.1.9l-7.1-4.1a3 3 0 0 0 0-1.6l7-4.1A3 3 0 1 0 15 5a3 3 0 0 0 .1.8L8.1 9.9a3 3 0 1 0 0 4.2l7.1 4.1A3 3 0 1 0 18 16z"/>'
    };

    function button(tag, label, icon, attrs) {
        var el = document.createElement(tag);
        el.className = 'share-btn';
        el.setAttribute('aria-label', label);
        el.title = label;
        Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
        el.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + icons[icon] + '</svg><span>' + label + '</span>';
        return el;
    }

    function popup(a) {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            window.open(a.href, 'share', 'width=620,height=520,noopener');
        });
    }

    function build(host) {
        host.classList.add('share-bar');
        host.setAttribute('role', 'group');
        host.setAttribute('aria-label', 'Share this article');
        var heading = document.createElement('span');
        heading.className = 'share-label';
        heading.textContent = 'Share';
        host.appendChild(heading);

        if (navigator.share) {
            var native = button('button', 'Share', 'share', { type: 'button' });
            native.addEventListener('click', function () {
                navigator.share({ title: title, url: url }).catch(function () {});
            });
            host.appendChild(native);
        }

        [
            ['X', 'x', 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u],
            ['LinkedIn', 'linkedin', 'https://www.linkedin.com/sharing/share-offsite/?url=' + u],
            ['Facebook', 'facebook', 'https://www.facebook.com/sharer/sharer.php?u=' + u]
        ].forEach(function (s) {
            var a = button('a', s[0], s[1], { href: s[2], target: '_blank', rel: 'noopener noreferrer' });
            popup(a);
            host.appendChild(a);
        });

        host.appendChild(button('a', 'Email', 'email', { href: 'mailto:?subject=' + t + '&body=' + encodeURIComponent(title + '\n' + url) }));

        var copy = button('button', 'Copy link', 'link', { type: 'button' });
        var label = copy.querySelector('span');
        copy.addEventListener('click', function () {
            function done() {
                label.textContent = 'Copied!';
                copy.classList.add('copied');
                setTimeout(function () { label.textContent = 'Copy link'; copy.classList.remove('copied'); }, 2000);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link:', url); });
            } else {
                window.prompt('Copy this link:', url);
            }
        });
        host.appendChild(copy);
    }

    document.querySelectorAll('[data-share]').forEach(build);
})();
