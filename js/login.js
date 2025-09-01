document.addEventListener('DOMContentLoaded', () => {
    

    
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Para fins de demonstração, você pode adicionar uma validação simples
            if (username === '' || password === '') {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Aqui você integraria com um backend real
            console.log('Dados de login:', { username, password });
            alert('Login simulado! Verifique o console para os dados.');

        });
    }

    // Você pode adicionar eventos para o botão GOV.BR aqui, se precisar
    const govBrButton = document.querySelector('.btn-secondary');
    if (govBrButton) {
        govBrButton.addEventListener('click', () => {
            alert('Redirecionando para login com GOV.BR (simulado)...');
            // Lógica para iniciar o fluxo de autenticação com GOV.BR
        });
    }
});