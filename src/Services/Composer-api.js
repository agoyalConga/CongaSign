export async function ComposerAPI(recordData, templateId, myCallback) {
    let salesforce_login_endpoint="https://login.salesforce.com/services/oauth2/token";
    let salesforce_client_id="3MVG9FMtW0XJDLd0ITFzq_pOPyc_1UV34Ep6YQAcDPuaK.81Q0aZ7vMp_MDit.2SfnxZVJWqKJnUcyBbrKsQk&client_secret=81907F947DD21A664FC23EB1D684AAE7EB194775BF8D29F555E28923C09F8926";
    let salesforce_client_secret="81907F947DD21A664FC23EB1D684AAE7EB194775BF8D29F555E28923C09F8926";
    let salesforce_userName="richard-v22.2.0@congademo.com";
    let salesforce_password="conga2022";
    let salesforce_login_redirect="https://richardv2220.my.salesforce.com/";
    let proxyUrl="https://congalabapi.azurewebsites.net/api/CLMAuth/ExecuteMethod";

    let conga_auth_endpoint="https://services.congamerge.com/api/v1/auth/connect/token";
    let proxy_url_encoded='https://congalabapi.azurewebsites.net/api/CLMAuth/ExecuteMethodFormURLEncode';
    let conga_merge_endpoint="https://services.congamerge.com/api/v1/ingress/Merge";
    let conga_status_endpoint="https://services.congamerge.com/api/v1/status/v1/Status";
    let conga_legacy_doc_download_endpoint="https://composer.congamerge.com/c8/services/v2/Document";
    let proxy_url_download="https://congalabadmin.azurewebsites.net/api/CLMAuth/DownloadFile";
    let orgURL= "https://richardv2220.my.salesforce.com";
    let orgId= "00D8a000003C7jgEAC";
    let userId= "0058a00000LNY8wAAH";
    let masterRecordId= "0018a000023i6zoAAA";
    //let templateId= "aA28a000000M0OVCA0";

    let SF_TOKEN;
    let CONGA_AUTH_TOKEN;
    let CorrelationID;
    let mergeStatus;
    let objextDataToMerge= recordData;

    console.log('>>>>START<<<<');
    /////// Salesforce Token
    let xhr= new XMLHttpRequest();
    xhr.open('POST',proxyUrl);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange= function() {
        if (xhr.readyState === 4) {
            SF_TOKEN= JSON.parse(xhr.response); 
            console.log('SF_TOKEN: '+SF_TOKEN.access_token);
        }
    }
    let data= {
        'json' : {},
        'methodType' : 'POST',
        'uri' : salesforce_login_endpoint+'?grant_type=password&client_id='+salesforce_client_id+'&username='+salesforce_userName+'&password='+salesforce_password+'&redirect_uri='+salesforce_login_redirect+'&client_secret='+salesforce_client_secret
    }
    xhr.send(JSON.stringify(data));

    ///////// Conga Authentication Token
    let xhr1= new XMLHttpRequest();
    xhr1.open('POST',proxy_url_encoded);
    xhr1.setRequestHeader("Accept", "application/json");
    xhr1.setRequestHeader("Content-Type", "application/json");
    xhr1.onreadystatechange= function() {
        if (xhr1.readyState === 4) {
            CONGA_AUTH_TOKEN= JSON.parse(xhr1.response);
            console.log('CONGA_AUTH_TOKEN: '+CONGA_AUTH_TOKEN.access_token);

            ////////////// Composer Merge Data
            let xhrMerge= new XMLHttpRequest();
            xhrMerge.open('POST', proxyUrl);
            xhrMerge.setRequestHeader("Accept", "application/json");
            xhrMerge.setRequestHeader("Content-Type", "application/json");
            xhrMerge.onreadystatechange= function() {
                if(xhrMerge.readyState === 4) {
                    CorrelationID= JSON.parse(xhrMerge.response);
                    console.log('CorrelationID: '+CorrelationID.correlationId);
                    
                    /////////// Merge Status Check
                    let xhrStatus= new XMLHttpRequest();
                    xhrStatus.onreadystatechange= function() {
                      if(xhrStatus.readyState === 4) {
                        mergeStatus= JSON.parse(xhrStatus.response);
                        console.log(JSON.parse(xhrStatus.response));
                        console.log('Status of Merge: '+mergeStatus.statusPersistanceRecord.message);

                        ////////// Download the Document
                        if(mergeStatus.statusPersistanceRecord.message==='Completed') {
                          clearInterval(intervalStatus);
                          let xhrDownloadDoc= new XMLHttpRequest();
                          xhrDownloadDoc.open('POST', proxy_url_download);
                          xhrDownloadDoc.setRequestHeader("Accept", "application/json");
                          xhrDownloadDoc.setRequestHeader("Content-Type", "application/json");
                          xhrDownloadDoc.onreadystatechange= function() {
                            if(xhrDownloadDoc.readyState === 4) {
                                console.log('SUCCESS: '+xhrDownloadDoc.response);
                                window.open(conga_legacy_doc_download_endpoint+'/'+orgId+'-'+userId+'-'+CorrelationID.correlationId+'?docid='+orgId+'-'+userId+'-'+CorrelationID.correlationId+'-1&getbinary=true');
                                myCallback(false);
                            }
                          }
                          let dataDownload= {
                            'json':{},
                            'authToken':CONGA_AUTH_TOKEN.access_token,
                            'methodType':'GET',  
                            'uri': conga_legacy_doc_download_endpoint+'/'+orgId+'-'+userId+'-'+CorrelationID.correlationId+'?docid='+orgId+'-'+userId+'-'+CorrelationID.correlationId+'-1&getbinary=true'
                          }
                          xhrDownloadDoc.send(JSON.stringify(dataDownload));
                        }
                      }
                    }
                    let dataStatus= {
                        'json': {},
                        'authToken':CONGA_AUTH_TOKEN.access_token,
                        'methodType': 'GET',
                        'uri': conga_status_endpoint+'/'+CorrelationID.correlationId
                    }
                    let intervalStatus= setInterval(()=> {
                      xhrStatus.open('POST', proxyUrl);
                      xhrStatus.setRequestHeader("Accept", "application/json");
                      xhrStatus.setRequestHeader("Content-Type", "application/json");
                      xhrStatus.send(JSON.stringify(dataStatus));
                    }, 3000);
              }
            }
            let dataMerge= {
              'json': {
                "SalesforceRequest": {
                "SessionId": SF_TOKEN.access_token,
                "TemplateId": templateId,
                "MasterId": masterRecordId,
                "ServerUrl": orgURL+"/services/Soap/u/50.0/"+orgId
                },
                "LegacyOptions": {
                "sc0": "1",
                "sc1": "SalesforceFile",
                "DefaultPDF": "1",
                "DS7": "11"
                },
                "jsonData" : JSON.stringify(objextDataToMerge)
              },
              'authToken': CONGA_AUTH_TOKEN.access_token,
              'methodType': 'POST',
              'uri': conga_merge_endpoint
            }
            xhrMerge.send(JSON.stringify(dataMerge));
            
        }
    }
    let data1= {
        'json':{
          'grant_type':'client_credentials',
          'scope':'doc-gen.composer',
          'client_id':'f21024ec-3a9a-4de6-a569-200965c8240f',
          'client_secret':'pQy4Q_P3RS121Jzxb@3ns8j5J'
        },
        'methodType':'POST',
        'uri': conga_auth_endpoint
    }
    xhr1.send(JSON.stringify(data1));
}