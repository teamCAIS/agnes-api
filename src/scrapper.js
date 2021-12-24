const axios = require('axios');
const fs = require('fs');

/* 
    APIS USADAS:

    - EDUCAÇÃO INTELIGENTE - http://educacao.dadosabertosbr.com/api
    Para coleta de escolas

    - POSITION STACK - http://api.positionstack.com
    Para ajuste de escolas sem endereço
    
*/

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function getAddress(latitude, longitude) {
    for (var i=0; i<10; i++) {
        try {
            const req = await axios.get(`http://api.positionstack.com/v1/reverse?access_key=910a6c2ce30884762712e3ecfbe04caa&query=${latitude},${longitude}`);
            if (req) {
                return req.data.data[0].label;
            } else {
                console.log(`Escola ${code} deu erro. Tentativa ${i}`);
            }
        } catch (error) {
            console.log('Erro na requisição');
        }
    }
}

async function seedSchools() {
    try {
        const schoolsInfo = [];
        fs.readFile('./schoolsData.json', async (err, data) => {
            if (err) throw err;
            const schools = JSON.parse(data);
            for (let i = 0; i < schools.length; i++) {
                const currentSchool = schools[i];
                if (currentSchool.address === '*** Endereço não localizado. Mostrando localização aproximada ***') {
                    const [longitude, latitude] = currentSchool.location.coordinates;
                    const address = await getAddress(latitude, longitude);
                    const schoolWithAddress = {
                        ...currentSchool,
                        address,
                    };
                    
                    schoolsInfo.push(schoolWithAddress);
                } else {
                    console.log("Escola " + currentSchool.code + " já tem endereço");
                    schoolsInfo.push(currentSchool);
                }
            }

            fs.writeFileSync('./schoolsWithAddress.json', JSON.stringify(schoolsInfo));
            console.log("Fim")
        });
    } catch (error) {
        console.log(error.data);
    }
}

module.exports = seedSchools;