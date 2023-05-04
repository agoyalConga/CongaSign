import axios from 'axios';

const salesforce_login_endpoint = "https://login.salesforce.com/services/oauth2/token";
const salesforce_client_id = "3MVG9FMtW0XJDLd0ITFzq_pOPyc_1UV34Ep6YQAcDPuaK.81Q0aZ7vMp_MDit.2SfnxZVJWqKJnUcyBbrKsQk&client_secret=81907F947DD21A664FC23EB1D684AAE7EB194775BF8D29F555E28923C09F8926";
const salesforce_client_secret = "81907F947DD21A664FC23EB1D684AAE7EB194775BF8D29F555E28923C09F8926";
const salesforce_userName = "richard-v22.2.0@congademo.com";
const salesforce_password = "conga2022";
const salesforce_login_redirect = "https://richardv2220.my.salesforce.com/";
const proxyUrl = "https://congalabapi.azurewebsites.net/api/CLMAuth/ExecuteMethod";
const proxy_url_encoded= "https://congalabapi.azurewebsites.net/api/CLMAuth/ExecuteMethodFormURLEncode/";

const Conga_base_endpoint = "https://services.congamerge.com";
const conga_auth_end = "/api/v1/auth/connect/token";
const SFTokenURL = `${salesforce_login_endpoint}?grant_type=password&client_id=${salesforce_client_id}&username=${salesforce_userName}&password=${salesforce_password}&redirect_uri=https://richardv2220.lightning.force.com//&client_secret=${salesforce_client_secret}`;

const orgURL = "https://richardv2220.my.salesforce.com";
const orgId = "00D8a000003C7jgEAC";
const userId = "0058a00000LNY8wAAH";
const masterRecordId = "0018a000023i6zoAAA";

const getSalesforceToken = async () => {
    const dataSFToken = {
        json: {},
        methodType: "POST",
        uri: SFTokenURL,
    };
    const res = await axios.post(proxyUrl, dataSFToken);
    console.log(res.data.access_token);
    return res.data.access_token;
};

const getFileData = async (agrId) => {
    const sftoken = await getSalesforceToken();
    const query = `select id, ContentDocumentId from ContentDocumentLink where LinkedEntityId = '${masterRecordId}' ORDER BY ContentDocument.LastModifiedDate DESC LIMIT 1`;
    console.log(query);
    const queryUrl = `https://richardv2220.my.salesforce.com/services/data/v56.0/query/?q=${query}`;
    const res = await axios.get(queryUrl, {
        headers: {
            Authorization: `Bearer ${sftoken}`,
        },
    });
    //console.log("here2", res.data);
    const queryContentVersion = `select id, VersionData from ContentVersion where ContentDocumentId = '${res.data.records[0].ContentDocumentId}'`;
    const queryUrlCV = `https://richardv2220.my.salesforce.com/services/data/v56.0/query/?q=${queryContentVersion}`;
    const cvRes = await axios.get(queryUrlCV, {
        headers: {
            Authorization: `Bearer ${sftoken}`,
        },
    });
    //debugger;
    console.log("here2", cvRes.data.records);
    const file = await axios({
        method: "get",
        url: `https://richardv2220.my.salesforce.com/${cvRes.data.records[0].VersionData}`,
        headers: {
            Authorization: `Bearer ${sftoken}`,
        },
        responseType: "blob",
    });
    console.log('blob',file);
    console.log('blobData',file.data);
    return file.data;
};

const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
});

const createPayload = (recipient) => {
    const payload = {
        roles: [
            {
                id: "Signer1",
                signers: [
                    {
                        email: recipient.Email,
                        firstName: recipient.Name,
                        lastName: "test",
                        company: "Conga Sign",
                    },
                ],
            },
            {
                id: "Role2",
                signers: [
                    {
                        email: "jaynayak@conga.com",
                        firstName: "Jay",
                        lastName: "Nayak",
                        company: "Conga Sign",
                    },
                ],
            },
        ],
        documents: [
            {
                approvals: [
                    {
                        role: "Signer1",
                        fields: [
                            {
                                page: 0,
                                top: 100,
                                subtype: "FULLNAME",
                                height: 50,
                                left: 100,
                                width: 200,
                                type: "SIGNATURE",
                            },
                        ],
                    },
                    {
                        role: "Role2",
                        fields: [
                            {
                                page: 0,
                                top: 300,
                                subtype: "FULLNAME",
                                height: 50,
                                left: 100,
                                width: 200,
                                type: "SIGNATURE",
                            },
                        ],
                    },
                ],
                name: `Agreement for - ${recipient.Name}.docx`,
            },
        ],
        name: recipient.Name,
        type: "PACKAGE",
        language: "en",
        emailMessage: "Please Sign the Document.",
        description: "New Package",
        autocomplete: true,
        status: "SENT",
    };
    return payload;
}

export const sendForSignature = async (obj) => {
    console.log(">>>START<<<");
    const data = {
        json: {
            'grant_type': "client_credentials",
            'scope': "sign",
            'client_id': "conga-se-sandbox",
            'client_secret': "3IUqivZc64Ot3lCpn3hYZyEI061Hf93X",
        },
        'methodType': 'POST',
        'uri': 'https://services.congamerge.com/api/v1/auth/connect/token'//Conga_base_endpoint + conga_auth_end
    };
    //const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    //const sendDocForSign = async () => {
        const tokenRes = await axios.post(proxy_url_encoded, data, {});
        console.log('tokenRes: ', tokenRes);
        const fileRes = await getFileData(masterRecordId);
        if (fileRes !== null) {
            let fileBlob = await convertBlobToBase64(fileRes);
            fileBlob= String(fileBlob);
            //console.log(fileBlob);
            fileBlob = fileBlob.split(',')[1];
            console.log(fileBlob);
            const payload = createPayload(obj);
            var form = {
                payload: payload,
                file: fileRes,
            }
            // var bodyFormData = new FormData();
            // bodyFormData.append("payload", JSON.stringify(payload));
            // bodyFormData.append("file", fileBlob, "test.txt");

            const signRes = await axios.post(proxy_url_encoded,
                {
                    'json': form,//bodyFormData,
                    'authToken': `Bearer ${tokenRes.data.access_token}`,
                    'methodType': 'POST',
                    'uri': `${Conga_base_endpoint}/api/v1/sign/cs-packages`
                }
            );
            console.log('Sign Response:', signRes);
        }
    //};
}