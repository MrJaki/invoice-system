const PdfPrinter = require('pdfmake/src/printer');
const fs = require('fs');
const path = require('path');

const fontsPath = path.join(__dirname, '..', 'fonts');

const printer = new PdfPrinter({
  Roboto: {
    normal: path.join(fontsPath, 'Roboto-Regular.ttf'),
    bold: path.join(fontsPath, 'Roboto-Medium.ttf'),
    italics: path.join(fontsPath, 'Roboto-Italic.ttf'),
    bolditalics: path.join(fontsPath, 'Roboto-MediumItalic.ttf')
  }
});

function buildDocDefinition(data, user) {

    var znesekBrezDDV = 0;

    data.vrstice.map(z => {
        znesekBrezDDV += (z.cena * z.kolicina);
    })

    var ddv = data.znesek - znesekBrezDDV;

    const docDefinition = {
        pageMargins: [40, 40, 40, 60],

        content: [

            {
                columns: [
                    [
                        {
                            text: user.naziv,
                            fontSize: 24,
                            bold: true,
                            color: '#2C3E50'
                        },
                        {
                            text: user.pravni_naziv + '\n' + user.ulica + '\n' + user.mesto + '\n' + user.davcna_st,
                            margin: [0, 5, 0, 0],
                            color: '#666666'
                        }
                    ],
                    [
                        {
                            text: 'RAČUN',
                            alignment: 'right',
                            fontSize: 28,
                            bold: true,
                            color: '#3498DB'
                        },
                        {
                            text: "R-" + data.stevilka_racuna,
                            alignment: 'right',
                            color: '#666666'
                        }
                    ]
                ]
            },

            {
                canvas: [
                    {
                        type: 'line',
                        x1: 0,
                        y1: 5,
                        x2: 515,
                        y2: 5,
                        lineWidth: 1,
                        lineColor: '#3498DB'
                    }
                ],
                margin: [0, 15, 0, 20]
            },

            {
                columns: [
                    {
                        width: '*',
                        stack: [
                            {
                                text: 'PREJEMNIK',
                                bold: true,
                                color: '#3498DB',
                                margin: [0, 0, 0, 8]
                            },
                            {
                                table: {
                                    widths: ['*'],
                                    body: [[
                                        {
                                            border: [true, true, true, true],
                                            borderColor: ['#DDDDDD', '#DDDDDD', '#DDDDDD', '#DDDDDD'],
                                            margin: [8, 8, 8, 8],
                                            stack: [
                                                { text: data.naziv_komitenta, bold: true },
                                                data.ulica,
                                                data.mesto,
                                                data.davcna_st
                                            ]
                                        }
                                    ]]
                                },
                                layout: 'noBorders'
                            }
                        ]
                    },

                    {
                        width: 180,
                        table: {
                            widths: [80, '*'],
                            body: [
                                ['Št. računa', "R-" + data.stevilka_racuna],
                                ['Datum', new Date(data.datum_izstavitve).toLocaleDateString("sl")],
                                ['Valuta', new Date(data.datum_valute).toLocaleDateString("sl")]
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    }
                ]
            },

            {
                margin: [0, 30, 0, 0],

                table: {
                    headerRows: 1,
                    widths: [45, 60, '*', 80, 90],

                    body: [
                        [
                            {
                                text: 'KOL.',
                                fillColor: '#3498DB',
                                color: 'white',
                                bold: true
                            },
                            {
                                text: 'ENOTA',
                                fillColor: '#3498DB',
                                color: 'white',
                                bold: true
                            },
                            {
                                text: 'OPIS',
                                fillColor: '#3498DB',
                                color: 'white',
                                bold: true
                            },
                            {
                                text: 'CENA',
                                fillColor: '#3498DB',
                                color: 'white',
                                bold: true,
                                alignment: 'right'
                            },
                            {
                                text: 'SKUPAJ',
                                fillColor: '#3498DB',
                                color: 'white',
                                bold: true,
                                alignment: 'right'
                            }
                        ],
                        ...data.vrstice.map(z => [
                            z.kolicina,
                            z.tip_kolicine,
                            z.opis,
                            {
                                text: `${z.cena.toFixed(2)} €`,
                                alignment: 'right'
                            },
                            {
                                text: `${(z.kolicina * z.cena).toFixed(2)} €`,
                                alignment: 'right'
                            }
                        ])
                    ]
                },

                layout: {
                    fillColor: function (rowIndex) {
                        if (rowIndex === 0) return null;
                        return rowIndex % 2 === 0 ? '#F8FAFC' : null;
                    }
                }
            },

            {
                columns: [
                    {
                        width: '*',
                        text: ''
                    },

                    {
                        width: 220,
                        margin: [0, 25, 0, 0],

                        table: {
                            widths: ['*', 90],
                            body: [
                                ['Osnova', znesekBrezDDV.toFixed(2)+ " €"],
                                ['DDV ' + data.stopnja + '%', ddv.toFixed(2) + " €"],
                                [
                                    {
                                        text: 'SKUPAJ',
                                        bold: true,
                                        fillColor: '#3498DB',
                                        color: 'white'
                                    },
                                    {
                                        text: data.znesek + " €",
                                        bold: true,
                                        fillColor: '#3498DB',
                                        color: 'white'
                                    }
                                ]
                            ]
                        }
                    }
                ]
            },

            {
                margin: [0, 50, 0, 0],

                table: {
                    widths: ['*'],
                    body: [[
                        {
                            fillColor: '#F8FAFC',
                            margin: [10, 10, 10, 10],
                            stack: [
                                {
                                    text: 'PLAČILNI PODATKI',
                                    bold: true,
                                    color: '#3498DB'
                                },
                                'IBAN: ' + user.iban,
                                'Banka: ' + user.banka,
                            ]
                        }
                    ]]
                }
            }
        ],

        defaultStyle: {
            fontSize: 10
        }
    };

    return docDefinition;
}

function generatePdf(data, user) {
    return printer.createPdfKitDocument(buildDocDefinition(data, user));
}

function brezSumnikov(text) {
    if (!text) return;
    let textWithS = text.replace(/š/g, "s").replace(/Š/g, "S");
    let textWithC = textWithS.replace(/č/g, "c").replace(/Č/g, "C");
    let result = textWithC.replace(/ž/g, "z").replace(/Ž/g, "Z");
    return result;
}

module.exports = { generatePdf };