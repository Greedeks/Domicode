document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const counterElements = document.querySelectorAll('.counter-number');
    const headingElement = document.querySelector(".preview h3");
    const orderForm = document.getElementById('orderForm');
    const phoneInput = document.getElementById('phone');
    const orderModal = document.getElementById('orderModal');

    const phrases = [
        "Уют в каждой детали интерьера",
        "Создаём пространства для жизни",
        "Инновации в каждом проекте",
        "Дизайн, который вдохновляет",
        "Будущее домостроения уже здесь",
        "Реализация проектов любой сложности",
        "Мебель и освещение под ваш образ жизни"
    ];

    const validationRules = {
        firstName: /^(?!.*(.)\1{2})[А-Яа-яЁёA-Za-z\s-]{2,}$/,
        lastName: /^(?!.*(.)\1{2})[А-Яа-яЁёA-Za-z\s-]{2,}$/,
        phone: /^\+375\s?\(\d{2}\)\s?\d{3}-\d{2}-\d{2}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        city: /^(?!.*(.)\1{2})[А-Яа-яЁёA-Za-z\s-]{2,}$/,
        address: /^(?=.*[A-Za-zА-Яа-яЁё])(?=.*\d)[A-Za-zА-Яа-яЁё0-9\s.,-]{5,}$/
    };

    const errorMessages = {
        firstName: 'Введите корректное имя (только буквы, минимум 2 символа).',
        lastName: 'Введите корректную фамилию (только буквы, минимум 2 символа).',
        phone: 'Введите номер в формате +375 (XX) XXX-XX-XX.',
        email: 'Введите корректный email (например: example@gmail.com).',
        city: 'Введите корректный город (только буквы, минимум 2 символа).',
        address: 'Введите корректный адрес (улица + номер дома).'
    };

    let currentPhraseIndex = 0;

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        cards.forEach(card => {
            if (card.getBoundingClientRect().top < triggerBottom) {
                card.classList.add('visible');
            }
        });
    }

    function animateText() {
        headingElement.classList.remove("p-text-slide-in");
        headingElement.classList.add("p-text-slide-out");

        setTimeout(() => {
            currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
            headingElement.textContent = phrases[currentPhraseIndex];
            headingElement.classList.remove("p-text-slide-out");
            headingElement.classList.add("p-text-slide-in");
        }, 600);
    }

    function animateCounter(element, target) {
        let current = 0;
        const duration = Math.min(2000, 500 + target * 2);
        const steps = 60;
        const increment = target / steps;
        const stepTime = duration / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current).toLocaleString();
            }
        }, stepTime);
    }

    function animateCounters() {
        counterElements.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;

            if (isVisible && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            }
        });
    }

    // Form
    function clearFormInputs() {
        const formFields = ['firstName', 'lastName', 'phone', 'email', 'city', 'address'];
        
        formFields.forEach(fieldId => {
            const input = document.getElementById(fieldId);
            const errorDiv = input.nextElementSibling;
            
            input.value = '';
            input.classList.remove('input-error');
            errorDiv.textContent = '';
        });
    }

    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorDiv = input.nextElementSibling;
        
        input.classList.add('input-error');
        errorDiv.textContent = message;
    }

    function validateForm() {
        let isValid = true;

        Object.keys(validationRules).forEach(fieldId => {
            const input = document.getElementById(fieldId);
            const errorDiv = input.nextElementSibling;
            
            input.classList.remove('input-error');
            errorDiv.textContent = '';
        });

        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const city = document.getElementById('city').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!validationRules.firstName.test(firstName)) {
            showError('firstName', errorMessages.firstName);
            isValid = false;
        }

        if (!validationRules.lastName.test(lastName)) {
            showError('lastName', errorMessages.lastName);
            isValid = false;
        }

        if (!validationRules.phone.test(phone)) {
            showError('phone', errorMessages.phone);
            isValid = false;
        }

        if (!validationRules.email.test(email)) {
            showError('email', errorMessages.email);
            isValid = false;
        }

        if (!validationRules.city.test(city)) {
            showError('city', errorMessages.city);
            isValid = false;
        }

        if (!validationRules.address.test(address)) {
            showError('address', errorMessages.address);
            isValid = false;
        }

        return isValid;
    }

    function formatPhoneInput() {
        let value = phoneInput.value.replace(/\D/g, '');

        value = value.slice(0, 12);

        let format= "";

        if (value.length > 0) {
            format += "+" + value.substring(0, 3);
        }
        if (value.length >= 4) {
            format += " (" + value.substring(3, 5);
        }
        if (value.length >= 6) {
            format += ") " + value.substring(5, 8);
        }
        if (value.length >= 9) {
            format += "-" + value.substring(8, 10);
        }
        if (value.length >= 11) {
            format += "-" + value.substring(10, 12);
        }

        phoneInput.value = format;
    }

    function hideSuccessModal() {
        const modal = document.getElementById('SuccessModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
        clearTimeout(window.modalTimeout);
    }
    window.hideSuccessModal = hideSuccessModal;
    
    function handleFormSubmit(event) {
        event.preventDefault();
        if (!validateForm()) return;
        
        console.log(Object.fromEntries(new FormData(orderForm).entries()));
        
        const successModal = document.getElementById('SuccessModal');
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        orderForm.reset();
        const modal = bootstrap.Modal.getInstance(orderModal);
        modal.hide();
        
        window.modalTimeout = setTimeout(hideSuccessModal, 3000);
    }
    
    document.getElementById('SuccessModal').addEventListener('click', function(e) { if (e.target === this) { hideCustomModal(); } });
    
    window.addEventListener('scroll', () => {checkScroll(); animateCounters();});
    window.addEventListener('resize', checkScroll);
    
    orderForm.addEventListener('submit', handleFormSubmit);
    phoneInput.addEventListener('input', formatPhoneInput);
    orderModal.addEventListener('show.bs.modal', clearFormInputs);

    checkScroll();
    setInterval(animateText, 3000);
    animateCounters();
});