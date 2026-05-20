document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("select[value]").forEach((select) => {
        const value = select.getAttribute("value");
        if (value) {
            select.value = value;
        }
    });

    document.querySelectorAll("a[method][onclick]").forEach((anchor) => {
        const onclick = anchor.getAttribute("onclick");
        if (onclick) {
            anchor.removeAttribute("onclick");
            anchor.setAttribute("data-onclick", onclick);
        }
    });

    document.querySelectorAll("a[method]").forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();

            const onclickAfterCode = anchor.getAttribute("data-onclick");
            if (onclickAfterCode) {
                let onclickAfter = new Function(onclickAfterCode);
                if (!onclickAfter()) return false;
            }

            const href = anchor.getAttribute("href");
            const url = new URL(href, window.location.origin);

            const action = url.pathname;
            const method = anchor.getAttribute("method");

            const form = document.createElement("form");
            form.action = action;
            form.method = "POST";

            const csrfToken = document.querySelector('meta[name="_csrf"]')?.getAttribute("content") || "";

            const csrfInput = document.createElement("input");
            csrfInput.type = "hidden";
            csrfInput.name = "_csrf";
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);

            const methodInput = document.createElement("input");
            methodInput.type = "hidden";
            methodInput.name = "_method";
            methodInput.value = method;
            form.appendChild(methodInput);

            for (const [key, value] of url.searchParams.entries()) {
                const paramInput = document.createElement("input");
                paramInput.type = "hidden";
                paramInput.name = key;
                paramInput.value = value;
                form.appendChild(paramInput);
            }

            document.body.appendChild(form);
            form.submit();

            setTimeout(() => {
                form.remove();
            });
        });
    });
});
