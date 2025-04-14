document.addEventListener('DOMContentLoaded', function () {
    const analyzeBtn = document.getElementById('analyze-btn');
    const clearBtn = document.getElementById('clear-btn');
    const textInput = document.getElementById('text-input');
    const resultsSection = document.getElementById('results-section');
    const resultBadge = document.getElementById('result-badge');
    const nonToxicMeter = document.getElementById('non-toxic-meter');
    const toxicMeter = document.getElementById('toxic-meter');
    const nonToxicPercentage = document.getElementById('non-toxic-percentage');
    const toxicPercentage = document.getElementById('toxic-percentage');
    const loader = document.getElementById('loader');
    const currentYearElement = document.getElementById('current-year');

    currentYearElement.textContent = new Date().getFullYear();

    textInput.addEventListener('focus', function () {
        this.classList.add('focused');
    });

    textInput.addEventListener('blur', function () {
        if (this.value.trim() === '') {
            this.classList.remove('focused');
        }
    });

    analyzeBtn.addEventListener('click', function () {
        const text = textInput.value.trim();

        if (text === '') {
            showNotification('Please enter some text to analyze.', 'warning');
            return;
        }

        loader.style.display = 'block';
        resultsSection.style.display = 'none';

        const formData = new FormData();
        formData.append('text', text);

        fetch('/api/predict_sentiment', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                loader.style.display = 'none';

                processResults(data);
            })
            .catch(error => {
                console.error('Error:', error);
                loader.style.display = 'none';
                showNotification('An error occurred while analyzing the text. Please try again.', 'error');
            });
    });

    function processResults(data) {
        resultsSection.style.display = 'block';

        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const nonToxicProb = Math.round(data.probabilities[0][0] * 100);
        const toxicProb = Math.round(data.probabilities[0][1] * 100);

        setTimeout(() => {
            nonToxicMeter.style.width = `${nonToxicProb}%`;
            toxicMeter.style.width = `${toxicProb}%`;
        }, 100);

        nonToxicPercentage.textContent = `${nonToxicProb}%`;
        toxicPercentage.textContent = `${toxicProb}%`;

        if (data.predicted_label === 'Toxic') {
            resultBadge.className = 'badge badge-toxic';
            resultBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Toxic Content Detected';
        } else {
            resultBadge.className = 'badge badge-safe';
            resultBadge.innerHTML = '<i class="fas fa-check-circle"></i> Safe Content';
        }

        const resultDetails = document.getElementById('result-details');

        if (data.predicted_label === 'Toxic') {
            resultDetails.innerHTML = `
                <p>The content has been flagged as potentially toxic with ${toxicProb}% confidence. 
                This may indicate language that could be harmful, offensive, or inappropriate.</p>
            `;
        } else {
            resultDetails.innerHTML = `
                <p>The content appears to be non-toxic with ${nonToxicProb}% confidence. 
                No harmful or offensive language has been detected by our analysis.</p>
            `;
        }
    }

    clearBtn.addEventListener('click', function () {
        textInput.value = '';
        resultsSection.style.display = 'none';
        textInput.classList.remove('focused');
        textInput.focus();
    });

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;

        let icon;
        if (type === 'error') {
            icon = '<i class="fas fa-times-circle"></i>';
        } else if (type === 'warning') {
            icon = '<i class="fas fa-exclamation-circle"></i>';
        } else {
            icon = '<i class="fas fa-info-circle"></i>';
        }

        notification.innerHTML = `
            <div class="notification-content">
                ${icon}
                <p>${message}</p>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(notification);

        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'white';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.padding = '12px 16px';
        notification.style.zIndex = '1000';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '90%';
        notification.style.animation = 'slideIn 0.3s ease-out forwards';
        notification.style.display = 'flex';
        notification.style.justifyContent = 'space-between';
        notification.style.alignItems = 'center';

        if (type === 'error') {
            notification.style.borderLeft = '4px solid #e63946';
        } else if (type === 'warning') {
            notification.style.borderLeft = '4px solid #ffb703';
        } else {
            notification.style.borderLeft = '4px solid #4361ee';
        }

        const content = notification.querySelector('.notification-content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';

        const iconEl = content.querySelector('i');
        iconEl.style.marginRight = '12px';
        iconEl.style.fontSize = '20px';
        if (type === 'error') {
            iconEl.style.color = '#e63946';
        } else if (type === 'warning') {
            iconEl.style.color = '#ffb703';
        } else {
            iconEl.style.color = '#4361ee';
        }

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '4px';
        closeBtn.style.color = '#999';

        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        closeBtn.addEventListener('click', function () {
            notification.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.animation = 'slideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }

    textInput.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            analyzeBtn.click();
        }
    });
});