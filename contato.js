const email = document.getElementById("email-input");
const name = document.getElementById("nome-input");
const assunto = document.getElementById("assunto-input");
const msg = document.getElementById("msg");
document.getElementById("btn-enviar").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que a página recarregue
    enviarMensagem();
});
function enviarMensagem() {
    const nomeValor = name.value.trim();
    const emailValor = email.value.trim();
    const assuntoValor = assunto.value.trim();
    const msgValor = msg.value.trim();

    const regexNome = /^[A-Za-zÀ-ÿ\s]+$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nomeValor || !emailValor || !assuntoValor || !msgValor) {
        alert("Preencha todos os campos.");
        return;
    }

    if (!regexNome.test(nomeValor)) {
        alert("Nome inválido. Use apenas letras e espaços.");
        return;
    }

    if (!regexEmail.test(emailValor)) {
        alert("E-mail inválido.");
        return;
    }

    // Enviar com EmailJS
    emailjs.send("service_5cmmtfd", "template_l7t5tfq", {
        from_name: nomeValor,
        from_email: emailValor,
        subject: assuntoValor,
        message: msgValor
    }).then(function(response) {
        alert("Mensagem enviada com sucesso!");
        name.value = "";
        email.value = "";
        assunto.value = "";
        msg.value = "";
    }, function(error) {
        alert("Erro ao enviar. Tente novamente.");
        console.error(error);
    });
}
