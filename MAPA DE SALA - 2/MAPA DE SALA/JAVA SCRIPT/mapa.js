// =========================
// VARIÁVEIS GLOBAIS
// =========================
let salaSelecionada = null;

// =========================
// FUNÇÃO PARA CARREGAR DADOS AO ABRIR A PÁGINA
// =========================
window.onload = function () {
    for (let i = 1; i <= 12; i++) {
        var professor = localStorage.getItem("professor-" + i);
        var dataInicio = localStorage.getItem("data-inicio-" + i);
        var dataFinal = localStorage.getItem("data-final-" + i);
        var isInativa = localStorage.getItem("inativa-" + i) === "true";

        if (professor && dataInicio && dataFinal) {
            document.getElementById("professor-" + i).innerHTML = "Professor: " + professor;
            document.getElementById("data-" + i).innerHTML = "Data Início: " + dataInicio + "<br>Data Final: " + dataFinal;
            document.getElementById("sala-" + i).style.backgroundColor = "#1E90FF";
        }

        if (isInativa) { 
            inativarVisualmente(i);
        }
    }

    filtrarSalas('todas'); // Define "Todas as salas" como ativo ao carregar
};

// =========================
// FILTRAR SALAS 
// =========================
function filtrarSalas(tipo) {
    const salas = document.querySelectorAll(".salas");

    salas.forEach((sala) => {
        const salaId = sala.id.split("-")[1]; // Pega o número da sala
        const professor = localStorage.getItem("professor-" + salaId);
        const dataInicio = localStorage.getItem("data-inicio-" + salaId);
        const dataFinal = localStorage.getItem("data-final-" + salaId);
        const isInativa = localStorage.getItem("inativa-" + salaId) === "true"; // Verifica se a sala está inativa

        // Se for "Todas as Salas", mostra tudo (inclusive inativas)
        if (tipo === "todas") {
            sala.style.display = "flex";
            return;
        }

        // Se for "Salas Disponíveis", mostra apenas as que NÃO estão inativas e não têm conteúdo salvo
        if (tipo === "disponiveis") {
            if (!isInativa && !professor && !dataInicio && !dataFinal) {
                sala.style.display = "flex";
            } else {
                sala.style.display = "none";
            }
            return;
        }

        // Se for "Salas Ocupadas", mostra apenas as que NÃO estão inativas e têm conteúdo salvo
        if (tipo === "ocupadas") {
            if (!isInativa && professor && dataInicio && dataFinal) {
                sala.style.display = "flex";
            } else {
                sala.style.display = "none";
            }
            return;
        }
    });

    // Atualiza o botão ativo (muda o estilo visual)
    document.querySelectorAll(".button2").forEach((btn) => btn.classList.remove("active"));
    document.getElementById(`btn-${tipo}`).classList.add("active");
}


// =========================
// ABRIR INFORMAÇÕES DA SALA
// =========================
function abrirInfoSala(salaNumero, event) {
    event.stopPropagation();
    salaSelecionada = salaNumero;

    // Fecha os três pontos antes de abrir a info-sala
    FecharPontos(salaNumero);

    document.getElementById("overlay").style.display = "block";
    document.getElementById("info-sala").style.display = "block";
}

// =========================
// FECHAR INFORMAÇÕES DA SALA
// =========================
function fecharInfoSala() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("info-sala").style.display = "none";
}

// =========================
// SALVAR INFORMAÇÕES DA SALA (OCUPA A SALA)
// =========================
function salvarInformacoes() {
    var professor = document.getElementById("input-professor").value.trim();
    var dataInicio = document.getElementById("input-data-inicio").value;
    var dataFinal = document.getElementById("input-data-final").value;

    if (!professor || !dataInicio || !dataFinal) {
        alert("Preencha todos os campos antes de salvar!");
        return;
    }

    document.getElementById("professor-" + salaSelecionada).innerHTML = "Professor: " + professor;
    document.getElementById("data-" + salaSelecionada).innerHTML = "Data Início: " + dataInicio + "<br>Data Final: " + dataFinal;
    document.getElementById("sala-" + salaSelecionada).style.backgroundColor = "#1E90FF";

    // Salva no localStorage
    localStorage.setItem("professor-" + salaSelecionada, professor);
    localStorage.setItem("data-inicio-" + salaSelecionada, dataInicio);
    localStorage.setItem("data-final-" + salaSelecionada, dataFinal);

    // Altera a cor do texto para branco
    var sala = document.getElementById("sala-" + salaSelecionada);
    var salasTexto = sala.getElementsByClassName("p-salas");
    for (let i = 0; i < salasTexto.length; i++) {
        salasTexto[i].style.color = "white";
    }

    fecharInfoSala();
}

// =========================
// RESETAR SALA (DISPONIBILIZA A SALA)
// =========================
function resetarSala(salaNumero) {
    event.stopPropagation();

    // Remove as informações do localStorage (incluindo a inatividade)
    localStorage.removeItem("professor-" + salaNumero);
    localStorage.removeItem("data-inicio-" + salaNumero);
    localStorage.removeItem("data-final-" + salaNumero);
    localStorage.removeItem("inativa-" + salaNumero); // Remove a flag de inatividade

    // Atualiza a interface da sala
    document.getElementById("professor-" + salaNumero).innerHTML = "Professor: Não informado";
    document.getElementById("data-" + salaNumero).innerHTML = "Data Início: Não informada<br>Data Final: Não informada";

    var sala = document.getElementById("sala-" + salaNumero);
    sala.style.backgroundColor = "#8A2BE2"; 

    // Voltar o texto para branco
    var salasTexto = sala.getElementsByClassName("p-salas");
    for (let i = 0; i < salasTexto.length; i++) {
        salasTexto[i].style.color = "white";
    }

    // Fecha a info da sala e os três pontos
    fecharInfoSala();
    FecharPontos(salaNumero);
}


// =========================
// INATIVAR SALA
// =========================
function inativeSala(salaNumero) {
    event.stopPropagation();

    inativarVisualmente(salaNumero);
    localStorage.setItem("inativa-" + salaNumero, "true");

    fecharInfoSala();
    FecharPontos(salaNumero);
}

// =========================
// INATIVAR VISUALMENTE A SALA
// =========================
function inativarVisualmente(salaNumero) {
    document.getElementById("professor-" + salaNumero).innerHTML = "Inativa";
    document.getElementById("data-" + salaNumero).innerHTML = "Data Início: Indeterminado <br>Data Final: Indeterminado";

    var sala = document.getElementById("sala-" + salaNumero);
    sala.style.backgroundColor = "#efefef";
    sala.style.border = "2px solid #666666";

    var salasTexto = sala.getElementsByClassName("p-salas");
    for (let i = 0; i < salasTexto.length; i++) {
        salasTexto[i].style.color = "#666666";
    }
}

// =========================
// ABRIR MENU DOS TRÊS PONTOS
// =========================
function AbrirPontos(salaNumero, event) {
    event.stopPropagation();

    const pontosInfo = document.getElementById("pontosinformaçoes-" + salaNumero);
    const sala = document.getElementById("sala-" + salaNumero);
    const salasTexto = sala.getElementsByClassName("p-salas");

    if (pontosInfo.style.display === "block") {
        FecharPontos(salaNumero);
    } else {
        pontosInfo.style.display = "block";

        for (let i = 0; i < salasTexto.length; i++) {
            salasTexto[i].style.transform = "translateX(-30px)";
            salasTexto[i].style.transition = "transform 0.3s ease";
        }
    }
}

// =========================
// FECHAR MENU DOS TRÊS PONTOS
// =========================
function FecharPontos(salaNumero) {
    event.stopPropagation();

    const pontosInfo = document.getElementById("pontosinformaçoes-" + salaNumero);
    if (pontosInfo.style.display === "block") {
        pontosInfo.style.display = "none";
    }

    const sala = document.getElementById("sala-" + salaNumero);
    const salasTexto = sala.getElementsByClassName("p-salas");

    for (let i = 0; i < salasTexto.length; i++) {
        salasTexto[i].style.transform = "translateX(0px)";
    }
}