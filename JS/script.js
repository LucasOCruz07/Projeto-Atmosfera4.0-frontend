
document.addEventListener("DOMContentLoaded", () => {
    // Elementos dos cards
    const temperaturaCard = document.querySelector(".HT");
    const umidadeCard = document.querySelector(".HU");
    const co2Card = document.querySelector(".HA");
    const dispositivosCard = document.querySelector(".HD");

    const statusTemperatura = document.querySelector(".PT2");
    const statusUmidade = document.querySelector(".PU2");
    const statusCo2 = document.querySelector(".PA2");
    const statusDispositivos = document.querySelector(".PD2");

    const detalheTemperatura = document.querySelector(".temperatura");
    const detalheUmidade = document.querySelector(".humidade");
    const detalheCo2 = document.querySelector(".co2");

    const dataAtualizacao = document.querySelector(
        ".ultima-atualizacao strong"
    );

    const registro = document.querySelector(".registro-atuadores span");

    const botoesPeriodo = document.querySelectorAll(".graf-periodo button");

    // Limites dos sensores
    const limites = {
        temperaturaAviso: 25,
        umidadeMinima: 40,
        umidadeMaxima: 60,
        co2Aviso: 1000,
        co2Critico: 1400
    };

    // Dados iniciais simulados
    const sensores = {
        temperatura: 22.5,
        umidade: 49,
        co2: 1617
    };

    const dispositivos = [
        { nome: "ENV-A01", co2: 900 },
        { nome: "CO2-A02", co2: 1350 },
        { nome: "ENV-B01", co2: 810 },
        { nome: "ENV-BIB", co2: 756 },
        { nome: "NOT-REF", co2: 1044 },
        { nome: "ENV-PAT", co2: 576 },
        { nome: "ENV-GIN", co2: 1617 }
    ];

    // Formata a data de atualização
    function atualizarData() {
        if (!dataAtualizacao) return;

        const agora = new Date();

        const data = agora.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit"
        });

        const hora = agora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        dataAtualizacao.textContent = `${data}, ${hora}`;
    }

    // Atualiza o texto e a cor de um estado
    function atualizarStatus(elemento, texto, classe) {
        if (!elemento) return;

        elemento.textContent = `●${texto}`;
        elemento.classList.remove("status-normal", "status-aviso", "status-critico");
        elemento.classList.add(classe);
    }

    function statusTemperaturaAtual(valor) {
        if (valor >= limites.temperaturaAviso) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }

    function statusUmidadeAtual(valor) {
        if (
            valor < limites.umidadeMinima ||
            valor > limites.umidadeMaxima
        ) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }

    function statusCo2Atual(valor) {
        if (valor >= limites.co2Critico) {
            return ["Crítico", "status-critico"];
        }

        if (valor >= limites.co2Aviso) {
            return ["Aviso", "status-aviso"];
        }

        return ["Normal", "status-normal"];
    }



    // Atualiza as barras de concentração de CO2
    function atualizarBarrasCo2() {
        document.querySelectorAll(".barra-co2").forEach((barra, indice) => {
            const dispositivo = dispositivos[indice];
            if (!dispositivo) return;

            const valor = barra.querySelector(".co2-valor");
            const trilho = barra.querySelector(".co2-trilho");

            if (!valor || !trilho) return;

            const porcentagem = Math.min(
                (dispositivo.co2 / 1800) * 100,
                100
            );

            valor.style.width = `${porcentagem}%`;

            valor.classList.remove("normal", "aviso", "critico");

            if (dispositivo.co2 >= limites.co2Critico) {
                valor.classList.add("critico");
            } else if (dispositivo.co2 >= limites.co2Aviso) {
                valor.classList.add("aviso");
            } else {
                valor.classList.add("normal");
            }

            trilho.setAttribute(
                "title",
                `${dispositivo.nome}: ${dispositivo.co2} ppm`
            );
        });
    }



    // Seleção do período do gráfico
    botoesPeriodo.forEach((botao) => {
        botao.addEventListener("click", () => {
            botoesPeriodo.forEach((item) => {
                item.classList.remove("ativo");
            });

            botao.classList.add("ativo");

            const periodo = botao.textContent.trim();

            const grafico = document.querySelector(".graf-conteudo");

            if (grafico) {
                grafico.dataset.periodo = periodo;
            }
        });
    });

    // Inicialização
    atualizarSensores();
    atualizarBarrasCo2();

    // Atualização simulada a cada 5 segundos
    setInterval(simularSensores, 5000);
});


/* ========================================
   MENU LATERAL - ATMOSFERA 4.0
======================================== */

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");
const menuFundo = document.getElementById("menuFundo");
const fecharMenu = document.getElementById("fecharMenu");

function abrirMenu() {
    menuLateral.classList.add("aberto");
    menuFundo.classList.add("aberto");

    botaoMenu.setAttribute("aria-expanded", "true");
    menuLateral.setAttribute("aria-hidden", "false");
}

function fecharMenuLateral() {
    menuLateral.classList.remove("aberto");
    menuFundo.classList.remove("aberto");

    botaoMenu.setAttribute("aria-expanded", "false");
    menuLateral.setAttribute("aria-hidden", "true");
}

// Abrir ao clicar no botão do cabeçalho
botaoMenu.addEventListener("click", abrirMenu);

// Fechar pelo botão X
fecharMenu.addEventListener("click", fecharMenuLateral);

// Fechar ao clicar no fundo escurecido
menuFundo.addEventListener("click", fecharMenuLateral);

// Fechar ao retirar o mouse do menu
menuLateral.addEventListener("mouseleave", fecharMenuLateral);

// Fechar com a tecla Escape
document.addEventListener("keydown", function(evento) {
    if (evento.key === "Escape") {
        fecharMenuLateral();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const elementoGrafico = document.getElementById(
        "graficoTemperaturaUmidade"
    );

    if (!elementoGrafico) {
        console.error("Elemento do gráfico não encontrado.");
        return;
    }

    if (typeof Chart === "undefined") {
        console.error(
            "Chart.js não foi carregado. Verifique a biblioteca no HTML."
        );
        return;
    }

    const contexto = elementoGrafico.getContext("2d");

    // Dados demonstrativos para cada período.
    // Substitua pelos dados reais dos sensores quando disponíveis.
    const dadosGrafico = {
        "1h": {
            labels: [
                "09:00",
                "09:10",
                "09:20",
                "09:30",
                "09:40",
                "09:50",
                "10:00"
            ],
            temperatura: [22, 23, 22.5, 24, 23.5, 24.5, 24],
            umidade: [58, 56, 57, 54, 55, 52, 53]
        },

        "6h": {
            labels: [
                "04:00",
                "05:00",
                "06:00",
                "07:00",
                "08:00",
                "09:00",
                "10:00"
            ],
            temperatura: [19, 19.5, 20, 21, 22.5, 23, 24],
            umidade: [65, 64, 62, 60, 58, 56, 53]
        },

        "24h": {
            labels: [
                "10h",
                "14h",
                "18h",
                "22h",
                "02h",
                "06h",
                "10h"
            ],
            temperatura: [24, 27, 25, 22, 20, 19, 24],
            umidade: [53, 46, 50, 58, 65, 68, 53]
        }
    };

    // Gradientes das linhas.
    const gradienteTemperatura = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteTemperatura.addColorStop(
        0,
        "rgba(245, 160, 75, 0.25)"
    );

    gradienteTemperatura.addColorStop(
        1,
        "rgba(245, 160, 75, 0)"
    );

    const gradienteUmidade = contexto.createLinearGradient(
        0, 0, 0, 180
    );

    gradienteUmidade.addColorStop(
        0,
        "rgba(104, 169, 245, 0.20)"
    );

    gradienteUmidade.addColorStop(
        1,
        "rgba(104, 169, 245, 0)"
    );

    // Criação do gráfico.
    const grafico = new Chart(contexto, {
        type: "line",

        data: {
            labels: dadosGrafico["6h"].labels,

            datasets: [
                {
                    label: "Temperatura (°C)",

                    data: dadosGrafico["6h"].temperatura,

                    borderColor: "#f5a04b",
                    backgroundColor: gradienteTemperatura,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#f5a04b",
                    pointBorderColor: "#1b1d21",

                    fill: true,
                    tension: 0.4,

                    yAxisID: "eixoTemperatura"
                },

                {
                    label: "Umidade (%)",

                    data: dadosGrafico["6h"].umidade,

                    borderColor: "#68a9f5",
                    backgroundColor: gradienteUmidade,

                    borderWidth: 2,
                    pointRadius: 3,
                    pointHoverRadius: 5,

                    pointBackgroundColor: "#68a9f5",
                    pointBorderColor: "#1b1d21",

                    fill: true,
                    tension: 0.4,

                    yAxisID: "eixoUmidade"
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            interaction: {
                mode: "index",
                intersect: false
            },

            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#202329",
                    titleColor: "#ffffff",
                    bodyColor: "#e0e0e0",

                    borderColor: "#383c44",
                    borderWidth: 1,

                    padding: 10,

                    displayColors: true
                }
            },

            scales: {
                x: {
                    grid: {
                        display: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#9298a3",
                        font: {
                            size: 10
                        },

                        maxRotation: 0,
                        autoSkip: true
                    }
                },

                eixoTemperatura: {
                    type: "linear",
                    position: "left",

                    min: 10,
                    max: 35,

                    grid: {
                        color: "rgba(255, 255, 255, 0.06)"
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#f5a04b",
                        font: {
                            size: 10
                        },

                        callback: function (valor) {
                            return valor + "°";
                        }
                    }
                },

                eixoUmidade: {
                    type: "linear",
                    position: "right",

                    min: 0,
                    max: 100,

                    grid: {
                        drawOnChartArea: false
                    },

                    border: {
                        display: false
                    },

                    ticks: {
                        color: "#68a9f5",
                        font: {
                            size: 10
                        },

                        callback: function (valor) {
                            return valor + "%";
                        }
                    }
                }
            }
        }
    });

    
        });
 

