/**
 * B"H
 * if you're chatGPT account is connected,
 * a way to send and receive messages to your
 * ChatGPT account without paying for their API
 * token, using their backend API with your access
 * token.
 */
var sodos = require("../../../ayzarim/tools/sodos.js");
var AwtsmoosGPTify = require("../../scripts/tricks/awtsmoosGPTify.js");

var {customFetch, customTextEncoder} = require("../../scripts/tricks/customClient.js")


module.exports = {
    dynamicRoutes: async (info) => {
        await info.use("/", async () => {
            var realToken = null;
            var checkToken = info.cookies["awtsmoosGPT"];
            if(!checkToken) {
                return {
                    response: {
                        error: "You're account isn't connected to GPT"
                        +" or maybe u were logged out there."
                    }
                }
            }

            var token = checkToken.substring(3);
            var decrypted = null;
            
            try {
                decrypted = sodos.decrypt(token, info.server.secret);
                
            } catch(e) {
                return {
                    response: {
                        error: 
                        "PROBLEM decrypting",
                        details: e+""
                    }
                }
            }

            if(!decrypted) {
                return;
            }

            var prompt = info.$_POST.prompt ||
            "B\"H\n Tell me about the Awtsmoos in my own words, "
            +"centering around the number: "+Date.now()+". Make sure to include"
            +" every digit of the number in your story, detailed."

            var msg = ""
            try {
                
                var a = await AwtsmoosGPTify({
                    customFetch,
                    customTextEncoder,
                    authorizationToken: decrypted,
                    prompt,
                    onstream(e) {
                        
                    },
                    customHeaders: {
                        cookie: "intercom-device-id-dgkjq2bp=5198bea5-e094-44b4-b01b-0ccc2d68839d; __Secure-next-auth.callback-url=https://chatgpt.com; __Host-next-auth.csrf-token=c522a8025cc016d2942cdc780c3204e9be230596aa15dc4140acb7d89c09b4af|b1ffe58e795951b91240c139ade40f3b8ed48bae8b96aad7e6a46999b4c16a94; _cfuvid=DKoiG8Stl_Vac1dE9Dpeiyy6c7Ru1.pxscC60hbAWSw-1691698676737-0-604800000; cf_clearance=onFp8EVP2bxIIM90FNM86oSe4ToJ0DdcOw2UAwpqFC4-1691698711-0-1-51f6dfe7.25314e0f.4064705-0.2.1691698711; __cf_bm=78snp4h9XBiBe999IsQBxmwRrtPydV0BI8FpkgjWZeI-1691716046-0-AZoeicfY3Eqe3hTnt5krlN+M5DJrFIf9EGlvw5G+TfbsTuCcyZCxvbKlzEl44GYaT5hn9kx5A7eM5X4VMwyxO3k=; _puid=user-n92bdH4XWWyY3e987hzH7FBy:1691716588-facmT41r5aNFqNzi5lXs0NlF/ZFgB/fTBrtCyrN8ZB4=; intercom-session-dgkjq2bp=ZmZ6M3dCaVRyaWxRQnpnakFQTjJTV25MN2ZFeVFhVTVpNlBtQjJPeGdncjl3SkppOEFnYldSODZCMDBmUTRrNS0tdXRUSTdkSE1OV1Z4NHBYSThzMzlDZz09--8bee085f5ccab745c89ace5ac69942defb58ddae; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..rJ3SYw5IBdCFDLtg.M9BecpetjYW_I_NbY1TW-Vu26owaVnbspqWoOCkmPm48HAUHuv7AvyjoUYBJGWvsRq8feMMGEv8Dl9yTGD2Gq3liJcmmn9u4Ia0X8s_LaJ3E5Yg41-yy4_vrotefxZrTX9yG8axmDfdl19KD29QDd5_TXVsNhOcb9biaRg_SsfV-nSOMrx16LIOKVvuGQ3fTKe8xfQn0La1vzSPIcuGo3BQGqle3n4nmVy5oHrWx_4VEK3fFHJYNRrjO_fs7ZuBeLwQTn-k_mV1MmlJOazfCPwGx1AfVFqtA984fQpP1HMvaOepeFnA9v2EFnwg7h6dr-B1DfS3YdWfprE7Gm7Q_ivPHplvGtgO2D3kztVfcX5mhEociU3m_HvPIOquxvKDsohsoQ2CBVe2Ogd1uk2vOJuJYxzMxLqtIc2wZNfz-QIF8pFB96kgf0VfEt9xzngYY_U2uVArWwrDDJ8sx5PdQc4nJjJGesQxxXQ_yyilI-3IzX5ZnhGyWVqZ0V4keLVioxF6Slr2EQLx8Oxn-KDoftWz8av72X08eSp3ji3TKl12RXP9YwQgin2kv0cSVPEyoyI4dVjOT3Wy7jR-hDwSIK0kebMdU2BwEqh4D8JdiHL3aQRlVZjGZnPcVaNTkBxYujOPfmj9FwV3WH-PeljsR04wxFktJ2uLQCWC1UWxyvD9mkYxBFSGsNfRbQXgLAyGhDkZ1-_CuM9TsTHwVAvQBTA7BP93pUKvm543t-d3KtGi4zPpb6z2FlPvEqy85u4uAYd5TAlCccM8XTtB7RrYej9p1qBPwTJpn0WaB_c1uyXQP3oZ4EoR6vIughs5SOwlmpHURgX12JjJdynrKvwrbGFneOHiteZMBqu1zBitpXnvcM9H7YyeQNajYeBdsYXCn7T5Hk3e3Y4fdV_-U8tvxmmtErh0f1OiUPFA4QONhcmWhQVtpv5QYwpTiY12mEf9lOSMiq4f5E8_BVLxzs2oyetxEdPhCOLHQISzGws65TMe5DNX1ML8vEkRqMm5UQ7HLnk5wgZ86NzE-9-U4Jjscb0BfgJrrtrQS-5exUYLuQIjCn5EfGtX6cdaKCndaa210OUbb0vOz6FCUL09kApSZx2GzHJqftCGe3QzMsFA_FA-ZPgrO5LxfiumbGsJYqrOCy-M5c2Xp2ysGykscKjTl_EoZ3_zfGJI2jciJDlL64csWrR1Vydr4Kuwm4DFoeZhWap7gZrFElYjrwtPxesD1M_fFssduB3gFYB5RWSWjAJKcMDYiETFM48izXWSydH4IcxRoqrFEJDB5zhOJOwLO-uJMSb_CnKSSBCx4w5kZRiXG_-upQ_1rMpLER6mx7ZWJ9GdOK26yhN49UJW55H0JTEXm3EJU-6cpk_upnHgFY9vq2WNmSH4GMYL0DzWq3NS_w6shnPq6Y1yuq18TNE-lb8fH9fLUovs6ci4g9-iDpLb7iBlpPXcORyB8i-hQj261Tka1ndBsXEqttkOERWlhwFCzlViIdbICoJxaqgUuY8PbgyIOGSiX-rkNzK96xxQES-UaMu8yoOgPhITwsY9067BDqDi1Vjc5PPqUFmjmVA-jhR9b-EKeBxFnkWpUSp4iBpe2vdtRhndF9K1WXMj-oKgOVlwrx01tKmmpFrFztWlUz0QZY2fUTzpDlQX6dZM70qniY4GltSMi1uDBgImaBXpBRaIB7V-an3sZba0q23zNke9Z_sU7RHuJl-bkp4Y7DS26gxOCUwb6X52lC4d_PmMoI5EwZwU3jqVV7_LQ1DXl6f5ts2S15yKF6J7C6ZKLGIbDGuVxX6iO1d0KFP7E_dvkWuYZdrDb4gHqT-eBPpDyiclqQ4Cey7iq-jdGk8z6i9qucQrGgtRE-H7qKXFjOdmNcYISXuVrtnLFtNcfiY6jY-4xbWSC3yul0jeQ5MCKyza8Tn6eSmjWDwZit47TSlKOBcZPOFrLBAPLiGuWTaTUv08DrlkmnnwzPUOLciuXiHZVl5c1L9n2UTTe9vdYbr8c41pUbyxicNXrNZpx6F_OYcpGb4Mu-1hvpXLcv0J2CTc1Bc2DuMtljdzwmpceK1CvdbEMlcjlbjmnUFYUtcMjoRisEfnJ6wahEl2vCZyOrCKeeBrl9EN2cgfM-L7Une3_y_g7THGixQMaRpdX4bezvqKjbtWrpw9ZRde1gXVxVO0el_s3R8QH0yJmyVFHLZkQ5zmL_SZ6xHItimKrUDR5T2FYEBlUIQ_0nIFmkXy9u62iUSMX-Xjm7VLqX76aWCKwNbxfUWKuVtiVhzueVPvs4EKIs2XNsknyizTY4SbLiCQJ_vUi_6gj0FlkBAnFKDHBEFA8kxLcySBrZrfRV5dPGW_dsdsoTnn361QRGoUD0DqK7cZxofzTtvl4ZwLipgw9D59zIzp-4X1Xn8vinBaNllbwRRObvXCpxXhsgVcbQCrCH8lBgha5eZZuKb2CezKKOszr0FU4PH7yNFZiQV8-ZkFSGJldF1NXPdJjXyrSN3zpfFIW5X79o4147f6Uh3qEe9FJ-wQwo9XkPMd2lxslIx9KHpDk_QiKlkGJocAvT13ehCwQNcfzGbB5ZbuR3YU527lQ5vBbMmBmYv3A5izld9qUEEkIf601EvgQYhO1DCnK4nwcPWrrbkK5xFSNyW96S22oOhwbCsEwyRoarKM8NcPaU17bfvjPo-rMuGtv3kJj98NVjQnaDNm-OTWR5Vd8DoYgBMsqRyQnfJQGfLmI1x8Hta7CQOETdmq3TWp-Q-gpyBdW_J1X_01NkbpkmPE.UzBy9D7W9pa9g7-Yg_u7Vg; _dd_s=rum=0&expire=1691718000017"
                    }
                });
                if(a == "error") {
                    
                    return {
                        response: {
                            error: "Problem.",
                            info:info.headers
                        }
                    }
                }
                return {
                    response: {
                        "got response": a
                    }
                }
            } catch(e) {
                msg = e+""
                
            }
            return {
                response: {
                    vals: info.$_POST
                    ,msg
                }
            }
        });
    }
}