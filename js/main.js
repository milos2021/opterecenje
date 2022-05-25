tiketi = []
entry_time = null
slipTable = null
table = null
table2 = null
sec = null
groups = []
arr = []
const DANI = ["Ned", "Pon", "Uto", "Sre", "Čet", "Pet", "Sub"];
const MESECI = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Avg", "Sep", "Okt", "Nov", "Dec"];
$.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
    var searchTerm = $("#btnMatchLookup").val()
    if(settings.nTable.id == 'matches'){
        if(searchTerm==""){
            return true
        } else {
            if(data[1].toLowerCase().indexOf(searchTerm.toLowerCase())!=-1){
                return true
            } else {
                return false
            }
        }

    }
    if(settings.nTable.id == 'load'){
        return true
    }

    return true
    
});
$.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
    return this.api().column(col, { order: 'index' }).nodes().map(function (td, i) {
        var val_outcomes = td.querySelector("#outcomesSum");
        var val_full = td.querySelector("#fullSum");
        return (val_outcomes ? val_outcomes.innerText : val_full.innerText) * 1;
    });
}
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
        if (linija.BetParamText) {
            option += `&nbsp;(` + linija.BetParamText + `)</td>`
        } else {
            option += "</td>"
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
            return "<span title='Fudbal' class='filter-icon fudbal'></span>"
        case 2:
            return "<span title='Košarka' class='filter-icon kosarka'></span>"
        case 3:
            return "<span title='Tenis' class='filter-icon tenis'></span>"
        case 4:
            return "<span title='Rukomet' class='filter-icon rukomet'></span>"
        case 5:
            return "<span title='Odbojka' class='filter-icon odbojka'></span>"
        case 6:
            return "<span title='Hokej' class='filter-icon hokej'></span>"
        case 7:
            return "" //bejzbol
        case 8:
            return ""
        case 9:
            return ""
        case 10:
            return ""
        case 11:
            return "<span title='Golovi u ligi' class='filter-icon golovi-u-ligi'></span>"
        case 12:
            return "<span title='Igrači specijal' class='filter-icon igraci-specijal'></span>"
        case 13:
            return ""
        case 14:
            return "<span title='Futsal' class='futsal'></span>"
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
            return "<span title='Stoni tenis' class='stoni-tenis'></span>"
        case 26:
            return "<span title='Borilačke veštine' class='filter-icon borilacke-vestine'></span>"
        case 27:
            return ""
        case 28:
            return ""
        case 29:
            return "<span title='Pikado' class='pikado'></span>"
        case 30:
            return ""
        case 31:
            return "<span title='Snuker' class='filter-icon snuker'></span>"
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

    function convertToCurrency(value, zeros = false, test = false) {
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
        if (n) {
            var match = document.getElementById("yadcf-filter--load-3");
            var matchVal = match.value;
            var outcome = document.getElementById("yadcf-filter--load-4");
            var outcomeVal = outcome.value;
            var sport = document.getElementById("yadcf-filter--load-2");
            var sportVal = sport.value;
            var searchTerm = document.getElementById("btnMatchLookup")
            var searchTermVal = searchTerm.value;
        }
        $("#loader").removeClass("sakriven")
        $.ajax(
            {
                url: "http://10.0.90.23:8000/api/PrematchLoad",
                method: "GET",
                dataType: "json",
                success: function (obj) {
                    entry_time = obj.data[0]['Last Change']
                    $("#lastChange").html("Poslednja promena: " + formatDate(entry_time))
                    if (n) {
                        $("#lastChange").addClass("treptanje")
                        var searchTerm = document.getElementById("btnMatchLookup")
                        searchTerm.value = ""
                    }


                    groups = obj.data.reduce((groups, item) => {
                        const group = (groups[item['Match ID']] || []);
                        group.push(item);
                        groups[item['Match ID']] = group;
                        return groups;
                    }, {});
                    arr = []
                    for (let i = 0; i < Object.keys(groups).length; i++) {
                        let matchGroup = groups[Object.keys(groups)[i]]

                        let sum = matchGroup.reduce((x, y) => {
                            if (!y['ΣBet']) {
                                y['ΣBet'] = 0
                            }
                            return parseFloat(x) + parseFloat(y['ΣBet'])
                        }, 0)
                        let num = matchGroup.reduce((x, y) => {
                            if (!y['#Bets']) {
                                y['#Bets'] = 0
                            }
                            return parseFloat(x) + parseFloat(y['#Bets'])
                        }, 0)
                        let ki1 = matchGroup.filter(x => x.Outcome == 'KI 1')
                        let kix = matchGroup.filter(x => x.Outcome == 'KI X')
                        let ki2 = matchGroup.filter(x => x.Outcome == 'KI 2')
                        let o = matchGroup.filter(x => x.Outcome == 'UG 3+')
                        let u = matchGroup.filter(x => x.Outcome == 'UG 0-2')
                        var ki1odd = matchGroup.filter(x => x.Outcome == 'KI 1');
                        var kixodd = matchGroup.filter(x => x.Outcome == 'KI X');
                        var ki2odd = matchGroup.filter(x => x.Outcome == 'KI 2');
                        var uodd = matchGroup.filter(x => x.Outcome == 'UG 3+');
                        var oodd = matchGroup.filter(x => x.Outcome == 'UG 0-2');

                        arr.push({
                            start: matchGroup[0]['Start'],
                            event: matchGroup[0]['Match'],
                            ki1Bets: ki1.length > 0 ? ki1[0]['#Bets'] : 0,
                            kixBets: kix.length > 0 ? kix[0]['#Bets'] : 0,
                            ki2Bets: ki2.length > 0 ? ki2[0]['#Bets'] : 0,
                            oBets: o.length > 0 ? o[0]['#Bets'] : 0,
                            uBets: u.length > 0 ? u[0]['#Bets'] : 0,
                            ki1Sum: ki1.length > 0 ? ki1[0]['ΣBet'] : 0,
                            kixSum: kix.length > 0 ? kix[0]['ΣBet'] : 0,
                            ki2Sum: ki2.length > 0 ? ki2[0]['ΣBet'] : 0,
                            oSum: o.length > 0 ? o[0]['ΣBet'] : 0,
                            uSum: u.length > 0 ? u[0]['ΣBet'] : 0,
                            outcomes: matchGroup.length,
                            num,
                            sum,
                            ki1odd: ki1odd.length ? ki1odd[0]['Avg Odd'] : "/",
                            kixodd: kixodd.length ? kixodd[0]['Avg Odd'] : "/",
                            ki2odd: ki2odd.length ? ki2odd[0]['Avg Odd'] : "/",
                            uodd: uodd.length ? uodd[0]['Avg Odd'] : "/",
                            oodd: oodd.length ? oodd[0]['Avg Odd'] : "/",
                            id: matchGroup[0]['Match ID']
                        })
                    }

                    /*
                        0- start
                        1
                       2 3 - ki1 num
                       3 4 - kix num
                       4 5 - ki2 num
                        6 - 3+ num
                        7 - 0-2 num
                        8 - ki1 sum
                        9 - kix sum
                        10 - ki2 sum
                        11 - 3+ sum
                        12 - 0-2 sum
                        13 - outcomes num
                        14 - total num
                        15 - total sum
                        ... - odds
                        21 - id
                    */

                    var mecevi = new Array;
                    $.each(arr, function (index, value) {
                        var tempArray = new Array;
                        for (var o in value) {
                            if (o != 'Last Change')
                                tempArray.push(value[o]);
                        }
                        mecevi.push(tempArray);
                    })
                    //9 - bet, 10 - win
                    // dataSet.forEach(el=>{
                    //     el[10] = el[10]-el[9]
                    // })
                    if (table2 != null) {
                        table2.destroy()
                    }

                    table2 = $('#matches').DataTable({
                        pagingType: 'simple',
                        applyFilter: true,
                        autoWidth: false,
                        dom: 'frtlip',
                        data: mecevi,
                        bSortCellsTop: true,
                        orderCellsTop: true,
                        fixedHeader: true,
                        order: [[8, "desc"]],
                        pageLength: 20,
                        lengthMenu: [20, 50, 100],
                        columnDefs: [{
                            "defaultContent": "-",
                            "targets": "_all"
                        },
                        {
                            targets: 0,
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var dan = new Date(row[0]);
                                var cell = dan.getDate() + "." + MESECI[dan.getMonth()] + "</br>" + DANI[dan.getDay()] + "</br>" + String(dan.getHours()).padStart(2, '0') + ":" + String(dan.getMinutes()).padStart(2, '0');
                                return cell;
                            }
                        },
                        {
                            targets: 1,
                            className: 'matchCol',
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var home = row[1].split("-")[0]
                                var away = row[1].split("-")[1]
                                return home + "<br/>" + away;
                            }
                        },
                        {
                            targets: 2,
                            orderable: false,
                            sortable: false,
                            className: "odds",
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr>
                                <td>H</td>
                                <td>`+ (isNaN(row[15]) ? row[15] : row[15].toFixed(2)) + `</td>
                                </tr>
                                <tr>
                                <td>D</td>
                                <td>`+ (isNaN(row[16]) ? row[16] : row[16].toFixed(2)) + `</td>
                                </tr>
                                <tr>
                                <td>A</td>
                                <td>`+ (isNaN(row[17]) ? row[17] : row[17].toFixed(2)) + `</td>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 3,
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr><td>`+ row[2] + `</td></tr>
                                <tr><td>`+ row[3] + `</td></tr>
                                <tr><td>`+ row[4] + `</td></tr>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 4,
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr><td>`+ convertToCurrency(row[7]) + `</td></tr>
                                <tr><td>`+ convertToCurrency(row[8]) + `</td></tr>
                                <tr><td>`+ convertToCurrency(row[9]) + `</td></tr>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 5,
                            className: 'oddsCol',
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr>
                                <td>O</td>
                                <td>`+ row[18] + `</td>
                                </tr>
                                <tr>
                                <td>U</td>
                                <td>`+ row[19] + `</td>
                                </tr>
                                </table>
                                </td>
                                <td>
                                <table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 6,
                            orderable: false,
                            sortable: false,
                            className: "nums",
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr><td>`+ row[5] + `</td></tr>
                                <tr><td>`+ row[6] + `</td></tr>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 7,
                            orderable: false,
                            sortable: false,
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr><td>`+ convertToCurrency(row[10]) + `</td></tr>
                                <tr><td>`+ convertToCurrency(row[11]) + `</td></tr>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 8,
                            className: "outcomes",
                            orderDataType: "dom-text-numeric",
                            type: "numeric",
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr>
                                <td id="outcomesSum">`+ row[13] + `</td>
                                </tr>
                                <tr>
                                <td>Outcomes</td>
                                </tr>
                                </table>
                                `
                                return cell;
                            }
                        },
                        {
                            targets: 9,
                            className: "rowDetails",
                            orderDataType: "dom-text-numeric",
                            type: "numeric",
                            "render": function (data, type, row, meta) {
                                var cell = `
                                <table>
                                <tr>
                                <td>`+ convertToCurrency(row[14]) + `<span id="fullSum" style="display:none">` + row[14] + `</span></td></tr>
                                <tr>
                                <td>`+ convertToCurrency(row[12]) + `</td>
                                </tr>
                                
                                <tr class="detail">
                                <td style="cursor:pointer; color:indianred; font-weight:bold" id="`+ row[1] + `">Details</td>
                                </tr>
                                </table>
                                `

                                return cell;
                            }
                        }
                            // {
                            //     "defaultContent": "-",
                            //     "targets": 0,
                            //     "render": function (data, type, row, meta) {
                            //         var a = data;
                            //         var prvi = a.split("-")[2].substring(0, 2)
                            //         var drugi = a.split("-")[1]
                            //         var treci = a.split("-")[0]
                            //         var finalDate = prvi + "." + drugi + " " + a.split(" ")[1].slice(0, -3)
                            //         return '<span>' + finalDate + '</span>';
                            //     }
                            // }
                        ],


                    });


                    //Row click event handling
                    $('#matches').off().on('click', 'tbody td.rowDetails', function (event) {

                        var el = $("#yadcf-filter--load-3");
                        var row = this;
                        var id = row.querySelectorAll(".detail")[0].querySelector("td").getAttribute("id");
                        el.val(id).trigger("change")
                        el.val(id).trigger("change")

                        // el.val(id)
                        // el.trigger("change")
                    })



                    

                   

                    $('#btnMatchLookup').keyup(function () {
                        table2.draw();
                    });

                    if (table == null) {
                        // $('#load thead tr').eq(0)
                        //     .clone(true)
                        //     .addClass('filters')
                        //     .appendTo('#load thead');
                    }
                    if (table != null) {
                        table.destroy()
                    }
                    obj = obj.data;
                    var dataSet = new Array;
                    $.each(obj, function (index, value) {
                        var tempArray = new Array;
                        for (var o in value) {
                            if (o != 'Last Change')
                                tempArray.push(value[o]);
                        }
                        dataSet.push(tempArray);
                    })
                    table = $('#load').DataTable({
                        pagingType: 'simple',
                        autoWidth: false,
                        dom: 'frtlip',
                        data: dataSet,
                        orderCellsTop: true,
                        fixedHeader: true,
                        pageLength: 20,
                        order: [[9, "desc"]],
                        lengthMenu: [8, 20, 50, 70, 90, 120, 150, 180],
                        columnDefs: [{
                            "defaultContent": "-",
                            "targets": [6, 8, 9],
                            "render": $.fn.dataTable.render.number(',', '.', 0, '')
                        },
                        {
                            targets: [0, 1, 2, 3, 4],
                            orderable: false
                        },
                        {
                            targets: 1,
                            className: 'matchId'
                        },
                        {
                            targets: 2,
                            className: 'sportCol',
                            render: function (data, type, row, meta) {
                                return data
                            }
                        },
                        {
                            targets: 3,
                            className: "homeTeam",
                            render: function (data, type, row, meta) {
                                return data
                            }
                        },
                        {
                            targets: 4,
                            className: 'outcome'
                        },
                        {
                            targets: 5,
                            className: 'betsTot'
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
                            targets: 10,
                            render: function (data, type, row, meta) {
                                return "<span>" + data.toFixed(2) + "</span>"
                            }
                        },
                        {
                            targets: 7,
                            className: 'betsDirect',
                            render: function (data, type, row, meta) {
                                return "<span style='cursor:pointer'>" + data + "</span>"
                            }
                        }
                        ],



                    });
                    $('#load').off().on('click', 'tbody tr td', function () {
                        var col = $(this).index()
                        var data = table.row(this).data();
                        if (col == 7 && data[7] != 0) {
                            var data = table.row(this).data();
                            var to = entry_time.slice(0, -3);
                            var from = new Date(to);
                            from.setDate(from.getDate() - 5);
                            var code = data[4]
                            var matchId = data[1]

                            data = detectParam(code)
                            code = data.outcome;
                            param = data.param;
                            //1 - matchid
                            //5 - outcome
                            $("#loader").addClass("sakriven")
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
                                        pageLength: 6,
                                        lengthMenu: [6, 10, 20, 50, 100, 200, 500, 1000, 2000],
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

                                                var finalDate = day + "." + month + "." + year + " (" + DANI[dayIndex] + ")" + " " + hour + ":" + minute + ":" + seconds
                                                return '<span>' + finalDate + '</span>';
                                            }
                                        }

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
                                    $("#loader").addClass("sakriven")

                                }
                            });
                        }

                    });

                    yadcf.init(table,
                        [
                            {
                                column_number: 2,
                                filter_type: "select",
                                select_type: "select2"
                            },
                            {
                                column_number: 3,
                                filter_type: "select",
                                select_type: "select2"
                            },
                            {
                                column_number: 4,
                                filter_type: "select",
                                select_type: "select2"
                            },
                            {
                                column_number: 1,
                                filter_type: "text",
                            },
                            // {
                            //     column_number: 5,
                            //     filter_type: "multi_select",
                            //     select_type: 'select2'
                            // },

                        ],
                        {
                            cumulative_filtering: true
                        }
                    );



                    setTimeout(() => {
                        $("#lastChange").removeClass("treptanje")
                    }, 10000);


                    $("#loader").addClass("sakriven")
                    if (n) {
                        match = document.getElementById("yadcf-filter--load-3")
                        outcome = document.getElementById("yadcf-filter--load-4")
                        sport = document.getElementById("yadcf-filter--load-2")
                        sport.value = sportVal;
                        match.value = matchVal;
                        outcome.value = outcomeVal;
                        $("#yadcf-filter--load-3").trigger("change")
                        $("#yadcf-filter--load-4").trigger("change")
                        $("#yadcf-filter--load-2").trigger("change")
                    }

                    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
                        var searchTerm = $("#btnMatchLookup").val()
                        if(settings.nTable.id == 'matches'){
                            if(searchTerm==""){
                                return true
                            } else {
                                if(data[1].toLowerCase().indexOf(searchTerm.toLowerCase())!=-1){
                                    return true
                                } else {
                                    return false
                                }
                            }
                    
                        }
                        if(settings.nTable.id == 'load'){
                            return true
                        }
                    
                        return true
                        
                    });
                    if(n){
                        search = document.getElementById("btnMatchLookup")
                    search.value = searchTermVal;
                    $("#btnMatchLookup").trigger("keyup")
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            }
        )
    }

    function getSport(sport) {
        var id = 0;
        switch (sport) {
            case "Fudbal":
                id = 1;
                break;
            case "Košarka":
                id = 2;
                break;
            case "Tenis":
                id = 3;
                break;
            case "Rukomet":
                id = 4;
                break;
            case "Odbojka":
                id = 5;
                break;
            case "Hokej":
                id = 6;
                break;
            case "Igrači Specijal":
                id = 12;
                break;
            case "Futsal":
                id = 14;
                break;
            case "Stoni Tenis":
                id = 25;
                break;
            case "Borilačke Veštine":
                id = 26;
                break;
            case "Pikado":
                id = 29;
                break;
            case "Snuker":
                id = 31;
                break;
            default:
                break;
        }

        return detectSport(id)

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

