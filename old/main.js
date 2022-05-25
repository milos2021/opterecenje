tiketi = []
entry_time = null
slipTable = null
table = null
dani = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"]
sec = null
function format(d) {

    let linije = tiketi.filter(x => x.Id == d[0])[0]['linije']
    html = ""
    html += `<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%" id='slipMiniTable'>
           <thead>
              <tr>
                <th>DateTime</th>
                <th>Competition</th>
                <th>Event</th>
                <th>Bet Game Outcome</th>
                <th>Odds</th>
              </tr>
           </thead>
           <tbody>
    `

    for (let i = 0; i < linije.length; i++) {
        let linija = linije[i]
        let option =
            `<tr>
        <td>`+ formatLineDate(linija.StartDate) + `&nbsp;&nbsp;&nbsp;` + detectSport(linija.SportId) + `</td><td>` + linija.CompetitionName + `</td><td>` + linija.HomeCompetitorName + "-" + linija.AwayCompetitorName + `</td>`
            + `<td>` + linija.BetGameName + `&nbsp;` + linija.BetGameOutcomeCodeForPrinting;
            if(linija.BetParamText){
                option += `&nbsp;(` + linija.BetParamText + `)</td>`
            } else {
                option+="</td>"
            }
        if (linija.SlipGroupLineWinningStatus == null) {
            option += `<td>` + linija.BetOdds.toFixed(2) + `</td></tr>`
        } else {
            option += `<td style='color:#8cff00;'>` + linija.BetOdds.toFixed(2) + `</td></tr>`

        }
        html += option
    }

    html += `</tbody></table>`
    // `d` is the original data object for the row
    return html;
}

function formatLineDate(a) {
    var prvi = a.split("-")[2].substring(0, 2)
    var drugi = a.split("-")[1]
    var treci = a.split("-")[0]
    var finalDate = prvi + "." + drugi + " " + a.split(" ")[1].slice(0, -3)
    return finalDate
}

function detectSport(id) {
    switch (id) {
        case 1:
            return "<span class='filter-icon fudbal'></span>"
        case 2:
            return "<span class='filter-icon kosarka'></span>"
        case 3:
            return "<span class='filter-icon tenis'></span>"
        case 4:
            return "<span class='filter-icon rukomet'></span>"
        case 5:
            return "<span class='filter-icon odbojka'></span>"
        case 6:
            return "<span class='filter-icon hokej'></span>"
        case 7:
            return "" //bejzbol
        case 8:
            return ""
        case 9:
            return ""
        case 10:
            return ""
        case 11:
            return "<span class='filter-icon golovi-u-ligi'></span>"
        case 12:
            return "<span class='filter-icon igraci-specijal'></span>"
        case 13:
            return ""
        case 14:
            return "<span class='futsal'></span>"
        case 15:
            return ""
        case 16:
            return ""
        case 17:
            return ""
        case 18:
            return ""
        case 19:
            return ""
        case 20:
            return ""
        case 21:
            return ""
        case 22:
            return ""
        case 23:
            return ""
        case 24:
            return ""
        case 25:
            return "<span class='stoni-tenis'></span>"
        case 26:
            return "<span class='filter-icon borilacke-vestine'></span>"
        case 27:
            return ""
        case 28:
            return ""
        case 29:
            return "<span class='pikado'></span>"
        case 30:
            return ""
        case 31:
            return "<span class='filter-icon snuker'></span>"
        case 32:
            return ""
        default:
            return ""
    }
}
$(document).ready(function () {
    setInterval(function () {
        var minutes = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49, 53, 57]
        var minutesOver = [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58]
        var currTimeMin = new Date().getMinutes();

        if (minutes.includes(currTimeMin) && sec == null) {  // check every 5 mins
            initialLoad(true)
            sec = new Date().getSeconds()
        }

        if (minutesOver.includes(currTimeMin) && sec) {
            sec = null
        }
    }, 1000 * 20)
    $('#slipModal').modal('hide');

    // Setup - add a text input to each footer cell
    initialLoad()

    function convertToCurrency(value, zeros = true, test = false) {
        if (value === "None") return 0;
        if (!value) return 0;
        if (value == "/") {
            return value;
        }
        const formatter = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        });
        if (zeros) {
            return formatter.format(value).replace("$", "");
        } else {
            return formatter
                .format(value)
                .replace("$", "")
                .substring(0, formatter.format(value).replace("$", "").length - 3);
        }
    }

    function detectParam(code) {
        var outcome, param, apart;
        if (code.includes("|+|")) {
            apart = code.split("|+|")
            outcome = apart[0] + "|+|"
            param = apart[1]
        }
        else if (code.includes("|-|")) {
            apart = code.split("|-|")
            outcome = apart[0] + "|-|"
            param = apart[1]
        }
        else if (code.includes("H1") && (!code.includes("|+|") && !code.includes("|-|"))) {
            apart = code.split("H1")
            outcome = "H1"
            param = apart[1]
        }
        else if (code.includes("H2") && (!code.includes("|+|") && !code.includes("|-|"))) {
            apart = code.split("H2")
            outcome = "H2"
            param = apart[1]
        }
        else {
            outcome = code
            param = null
        }

        if (param) {
            param = param.trim()
        }

        return { outcome, param }
    }

    function initialLoad(n = false) {
        $("#loader").addClass("loading")
        $.ajax(
            {
                url: "http://10.0.90.23:8000/api/PrematchLoad",
                method: "GET",
                dataType: "json",
                success: function (obj) {
                    obj = obj.data;
                    entry_time = obj[0]['Last Change']
                    $("#lastChange").html("Poslednja promena: " + formatDate(entry_time))
                    if (n) {
                        $("#lastChange").addClass("treptanje")
                    }
                    var dataSet = new Array;
                    $.each(obj, function (index, value) {
                        var tempArray = new Array;
                        for (var o in value) {
                            if (o != 'Last Change')
                                tempArray.push(value[o]);
                        }
                        dataSet.push(tempArray);
                    })
                    //9 - bet, 10 - win
                    // dataSet.forEach(el=>{
                    //     el[10] = el[10]-el[9]
                    // })




                    if (table == null) {
                        $('#load thead tr').eq(0)
                            .clone(true)
                            .addClass('filters')
                            .appendTo('#load thead');
                    }
                    if (table != null) {
                        table.destroy()
                    }
                    table = $('#load').DataTable({
                        dom: 'frtlip',
                        data: dataSet,
                        orderCellsTop: true,
                        order:[[10, "desc"]],
                        fixedHeader: true,
                        pageLength: 20,
                        lengthMenu: [20, 50, 70, 90, 120, 150, 180],
                        columnDefs: [{
                            "defaultContent": "-",
                            "targets": [7, 9, 10],
                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                        },
                        {
                            "defaultContent": "-",
                            "targets": 0,
                            "render": function (data, type, row, meta) {
                                var a = data;
                                var prvi = a.split("-")[2].substring(0, 2)
                                var drugi = a.split("-")[1]
                                var treci = a.split("-")[0]
                                var finalDate = prvi + "." + drugi + " " + a.split(" ")[1].slice(0, -3)
                                return '<span>' + finalDate + '</span>';
                            }
                        },
                        {
                            targets: 11,
                            render: function (data, type, row, meta) {
                                return "<span>" + data.toFixed(2) + "</span>"
                            }
                        },
                        {
                            targets: 8,
                            render: function (data, type, row, meta) {
                                return "<span style='cursor:pointer'>" + data + "</span>"
                            }
                        }
                        ],
                        initComplete: function () {

                            var api = this.api();
                            
                            // For each column
                            api
                                .columns()
                                .eq(0)
                                .each(function (colIdx) {

                                    // Set the header cell to contain the input element
                                    var cell = $('.filters th').eq(
                                        $(api.column(colIdx).header()).index()
                                    );
                                    var title = $(cell).text();
                                    $(cell).html('<input type="text" placeholder="' + title + '" />');

                                    // On every keypress in this input
                                    $(
                                        'input',
                                        $('.filters th').eq($(api.column(colIdx).header()).index())
                                    )
                                        .off('keyup change')
                                        .on('keyup change', function (e) {
                                            e.stopPropagation();

                                            // Get the search value
                                            $(this).attr('title', $(this).val());
                                            var regexr = '({search})'; //$(this).parents('th').find('select').val();

                                            var cursorPosition = this.selectionStart;
                                            // Search the column for that value
                                            api
                                                .column(colIdx)
                                                .search(
                                                    this.value != ''
                                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                                        : '',
                                                    this.value != '',
                                                    this.value == ''
                                                )
                                                .draw();

                                            $(this)
                                                .focus()[0]
                                                .setSelectionRange(cursorPosition, cursorPosition);
                                        });
                                });

                        },



                    });

                    $('#load').off().on('click', 'tbody tr td', function () {
                        var col = $(this).index()
                        var data = table.row(this).data();
                        if (col == 8 && data[8] != 0) {
                            var data = table.row(this).data();
                            var to = entry_time.slice(0, -3);
                            var from = new Date(to);
                            from.setDate(from.getDate() - 5);
                            var code = data[5]
                            var matchId = data[1]

                            data = detectParam(code)
                            code = data.outcome;
                            param = data.param;
                            //1 - matchid
                            //5 - outcome
                            $("#loader").addClass("loading")
                            $.ajax({
                                url: "http://10.0.90.23:8000/api/SlipView",
                                method: "POST",
                                dataType: "json",
                                data: JSON.stringify({
                                    from: from.toISOString().replace("T", " ").replace("Z", ""), to, code, matchId, param: param, cs: 1
                                }),
                                success: function (obj) {
                                    tiketi = []
                                    groups = obj.tiket.reduce((groups, item) => {
                                        const group = (groups[item['Id']] || []);
                                        group.push(item);
                                        groups[item['Id']] = group;
                                        return groups;
                                    }, {});
                                    let ids = Object.keys(groups);
                                    ids.forEach(id => {
                                        let fixed = groups[id][0]
                                        let obj = {
                                            Id: fixed['Id'],
                                            ClientAcceptanceTime: fixed['ClientAcceptanceTime'],
                                            UserName: fixed['UserName'],
                                            NumberOfMatches: fixed['NumberOfMatches'],
                                            Amount: fixed['Amount'],
                                            SumOdds: fixed['SumOdds'],
                                            'Pot win': fixed['Pot win'],
                                            linije: []
                                        }
                                        groups[id].forEach(line => {
                                            obj.linije.push({
                                                BetGameOutcomeCodeForPrinting: line.BetGameOutcomeCodeForPrinting,
                                                BetOdds: line.BetOdds,
                                                BetParamText: line.BetParamText,
                                                SlipGroupLineWinningStatus: line.SlipGroupLineWinningStatus,
                                                HomeCompetitorName: line.HomeCompetitorName,
                                                AwayCompetitorName: line.AwayCompetitorName,
                                                CompetitionName: line.CompetitionName,
                                                StartDate: line.StartDate,
                                                BetGameName: line.BetGameName,
                                                SportId: line.SportId
                                            })
                                        })
                                        tiketi.push(obj)
                                    })

                                    var dataSet = new Array;
                                    $.each(tiketi, function (index, value) {
                                        var tempArray = new Array;
                                        for (var o in value) {
                                            if (o != 'linije')
                                                tempArray.push(value[o]);
                                        }
                                        dataSet.push(tempArray);
                                    })
                                    if (slipTable != null) {
                                        slipTable.destroy()
                                    }
                                    slipTable = $('#slips').DataTable({
                                        dom: 'frtlip',
                                        data: dataSet,
                                        orderCellsTop: true,
                                        fixedHeader: true,
                                        pageLength: 10,
                                        lengthMenu: [10, 20, 50, 100, 200, 500, 1000, 2000],
                                        columnDefs: [{
                                            "defaultContent": "-",
                                            "targets": [4, 6],
                                            "render": $.fn.dataTable.render.number(',', '.', 2, '')
                                        },
                                        {
                                            targets: 5,
                                            render: function (data, type, row, meta) {
                                                return "<span>" + data.toFixed(2) + "</span>"
                                            }
                                        },
                                        {
                                            targets: 0,
                                            className: 'slipData',
                                            render: function (data, type, row, meta) {
                                                return "<img class='plusIcon' src='img/plus.png' alt='plus'/><span style='color:#c00000; cursor:pointer'>" + data + "</span>"
                                            }
                                        },
                                        {
                                            "defaultContent": "-",
                                            "targets": 1,
                                            "render": function (data, type, row, meta) {
                                                var year = data.substr(0, 4)
                                                var day = data.substr(8, 2)
                                                var month = data.substr(5, 2)
                                                var hour = data.substr(11, 2)
                                                var minute = data.substr(14, 2)
                                                var seconds = data.substr(17, 2)
                                                var dayIndex = new Date(data).getDay()

                                                var finalDate = day + "." + month + "." + year + " (" + dani[dayIndex] + ")" + " " + hour + ":" + minute + ":" + seconds
                                                return '<span>' + finalDate + '</span>';
                                            }
                                        },
                                        ]
                                    });
                                    $('#slipModal').modal('show'); // calling the bootstrap modal

                                    $('#slips').off().on('click', 'tbody td.slipData', function (event) {
                                        event.preventDefault()
                                        var tr = $(this).closest('tr');
                                        var row = slipTable.row(tr);



                                        if (row.child.isShown()) {
                                            // This row is already open - close it
                                            $(this).html("<img class='plusIcon' src='img/plus.png' alt='plus'/><span style='color:#c00000; cursor:pointer'>" + row.data()[0] + "</span>")
                                            row.child.hide();
                                            // tr.removeClass('activeSlip')
                                            tr.removeClass('shown');
                                        }
                                        else {
                                            $(this).html("<img class='plusIcon' src='img/minus.png' alt='plus'/><span style='color:#c00000; cursor:pointer'>" + row.data()[0] + "</span>")
                                            // Open this row
                                            if (slipTable.row('.shown').length) {
                                                $('.slipData', slipTable.row('.shown').node()).click();
                                            }
                                            row.child(format(row.data())).show();
                                            $(row.child()).addClass('smalltable');
                                            // tr.addClass('activeSlip')
                                            tr.addClass('shown');
                                        }
                                    });
                                    $("#loader").removeClass("loading")

                                }
                            });
                        }

                    });

                    setTimeout(() => {
                        $("#lastChange").removeClass("treptanje")
                    }, 10000);

                
                    $("#loader").removeClass("loading")
                
                },
                error: function (err) {
                    console.log(err)
                }
            }
        )
    }

    function formatDate(data) {
        // var year = data.substr(0, 4)
        // var day = data.substr(8, 2)
        // var month = data.substr(5, 2)
        var hour = data.substr(11, 2)
        var minute = data.substr(14, 2)
        var seconds = data.substr(17, 2)
        // var dayIndex = new Date(data).getDay()

        var final = hour + ":" + minute + ":" + seconds

        return final
    }
});

