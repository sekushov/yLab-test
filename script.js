const modalWindow = document.querySelector(".modal");
let dataFromServer;

function showModal() {
    modalWindow.style.display = "flex";
    document.body.style.overflow = "hidden";
}
function hideModal() {
    modalWindow.style.display = "none";
    document.body.style.overflow = "";
}

function modal() {
    const modalTriggers = document.querySelectorAll(".modal_trigger");

    modalTriggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            showModal();
        });
    });
    modalWindow.addEventListener("click", (e) => {
        if(e.target === modalWindow || e.target.classList.contains("modal__close")) {
            hideModal();
        }
    });
}

function showLoggedInInterface() {
    const main = document.querySelector(".main");
    main.innerHTML = `
        <div class="main__center">
            <p>Вы авторизованы</p>
            <a href="#">${dataFromServer}</a>
        </div>
    `;
}

function form() {
    const message = function (email) {
        return {
            loading: "images/spinner.svg",
            success: `Вход выполнен через почту ${email}`,
            failure: "Что-то пошло не так"
        } 
    };
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        postData(form);
    });

    function postData(form) {
        function showInfoModal(message) {
            const prevModalContent = document.querySelector(".modal__content");
            prevModalContent.style.display = "none";
            showModal();
            const messageModal = document.createElement("div");
            messageModal.classList.add("modal__content");
            messageModal.innerHTML = `
                <div class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            `;
            document.querySelector(".modal").append(messageModal);
            setTimeout(() => {
                messageModal.remove();
                prevModalContent.style.display = "";
                hideModal();
            }, 2500);
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const messageStatus = document.createElement("img");
            messageStatus.src = message().loading;
            messageStatus.style.cssText = "display: block; margin: 0 auto";
            form.append(messageStatus);

            const formData = new FormData(form);
            const objFormData = {};
            formData.forEach(function(value, key) {
                objFormData[key] = value;
            });

            fetch("server.php", {
                method: "POST",
                body: JSON.stringify(objFormData)
            })
            .then(data => data.text())
            .then(data => {
                dataFromServer = data;
                showInfoModal(message(dataFromServer).success);
                messageStatus.remove();
                showLoggedInInterface()
            }).catch(() => {
                showInfoModal(message().failure);
                messageStatus.remove()
            }).finally(() => {
                form.reset();
            })
        });
    }
}


modal();
form(dataFromServer);



