const got = require('got');
const { JSDOM } = require('jsdom');

/**
 * @param id {String}
 */
module.exports = async id => {
    switch (id) {
        case 'saturday':
            id = "Sábados"
        break;
        case 'sunday':
        case 'holidays':
            id = "Domingos e feriados"
        break;
        default:
            id = "Dias úteis"
    }

    const { body } = await got("https://ttsl.pt/passageiros/horarios-de-ligacoes-fluviais/ligacao-barreiro-terreiro-do-paco/");
    const { window: { document } } = new JSDOM(body);
    const hours = { t1: {}, t2: {} }


    const [t1, t2] = Array.from(document.getElementById(id).children)
        .filter(element => element.classList.contains('table-responsive'))
        .map(tableContainer => {
            const item = Array.from(tableContainer.children[0].children);

            return {
                thead: item[0],
                tbody: item[1]
            }
        })

    const T1Hours = Array.from(t1.thead.children[0].children)
        .map(item => item.innerHTML)
    const T1Minutes = Array.from(t1.tbody.children)
        .map(item => Array.from(item.children).map(item => {
            let content = item.innerHTML;
            return content.trim() !== '' ? content.replace(/\D/g, '') : null
        }))
        .filter(item => item !== null)

    const T2Hours = Array.from(t2.thead.children[0].children)
        .map(item => item.innerHTML)
    const T2Minutes = Array.from(t2.tbody.children)
        .map(item => Array.from(item.children).map(item => {
            let content = item.innerHTML;
            return content.trim() !== '' ? content.replace(/\D/g, '') : null
        }))
        .filter(item => item !== null)

    T1Hours.forEach((item, column) => {
        hours.t1[item] = [];

        T1Minutes.forEach(row => {
            hours.t1[item].push(row[column])
        })
    })

    T2Hours.forEach((item, column) => {
        hours.t2[item] = [];

        T2Minutes.forEach(row => {
            hours.t2[item].push(row[column])
        })
    })


    return hours;
}
