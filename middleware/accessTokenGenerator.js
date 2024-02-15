const paseto = require('paseto');
const { V4: { sign } } = paseto;
const fs = require('fs');
const secret_key = "kjhfierhJFNC8RYE7#$%^&*()hiucb3yycbwichilhfiuhgvuivbiughiuah87$%^&*(bbhjJGYJGJHgfvo4t738t87TY(*y87w@#$%^&*(hufhcbqw4y6r4%^&*9udcahwubrgR^%&*(ngcqurGTB&CRHGrvygcyv%^*&nhctuihrn78*&T^Tcniutitynutvoyrnrgmuh87FGGUGCEUHVIYEWg78cuggnNHNvgruvuibaggUIGghewwiruht73y94u8Y7y&y&*y&(y*&YT7Q4Y&Y$&*Yybiucw*UC$IYvyvybt4h49bV*Y&4y98unybv987e4yv9*$Y*(#yv73y487yv8aybo8v4yby7yv854yt78y8(pypnioHOIAHB9V^#*&*T@%*yvyb784vu4y87y&$Y*yr8LCINRYO*NCY($yN(Y$*&yctotb7854ytvn*Y&NYCT$T(N*Weiotn5ntonrontca8bo7h;oiNX*$#Y(*439to84utny98POY(*$Y$#&nyx08t79bynP(*TY849bt9843vt9834yb9CNYWy4i34tiyiBYTbv4ycy874yc8o4uvn7*@387bt98UNcobg7ay97y7B*$7y89yb5y%$c;boyuw5977yt8vw54ybtiayNb4ytonaxhlhctboi87aB*YTI*4ytbpaiYPCHNIQB78to478yct9ey7yY*O&Y$y7y4ouyi7t98Y$Yy78t9y34tb84yv784973vbtp97ybvbi;oyoYW(*BYtv4luivwihv9aibgviyq3985yh3tuy3879y5Y@#*&%#*@$Ivbiuvyr4uiyr87tT&*T@#&F^QW6dcrGOTo&*yd%(3Y5H8Y4TYOY487OYO*Y(*YH8yuibyIYIOUBY#DYBUI#BYT#&*TBCbq873b5bt478gcwutrc78wrb43bt*&Y#t5tkUUHCI*R&t3ycbgruewvttIO&T*&T#&Irygcvuyr4iwugrvyag6$@*T%*&T*&#TR*&#GRYcvtr7wtc854trva4gtjkg;lkegopirgouirehjkgfvJKFGyetgribgaagoueIUBCIrBTG*T&WB$&B(*$)(7tcbhvitt849qvnvyisioevhtnhxogbB&YTRVB$tvuhiuavbhiutbvi4agv7Y&*WTR&$#Y%*Y)&*(Cvbuigtbuiwt87w4avouy4yighufvgCCkjkavbB*&RT#$^*&#Tbxuigtibucvh*#$%^&*()cagbrbcviuionb$%^&*()cnobigvtbqyruagrcehebu&%^&*()rvjbhubahiuhg5^&*hvhqgagrlubgvaitrwe9GBCQVUYgtrvt4gkgr4weitioY^&TQ#*&Y(*54yf78t5ioubiY^&*()#(4fy3buivyaiuwe4rb4hwvyut6*&*(vwuitgrwurigv4ytvr87b4rv4uguvqgwqbvrqwuivrIHBCUGR3tr6b3guyv67ti8bt&^IIT#tvu4y3gvrt3bicr7t4crb4cr4tr4tr84tr87bt44it46t87T^&T#@TUYRG#2uybcgru3tr6t2uyt87T*&#@8btb673t46y8&&#Y8UXB&tcygrvwtr7bt86vt*fherigheihviuerhbitvuwyeiuvthlbugtriu4yr8743y5386^#*^^BXC!Vt46t8T*te8c323h"

async function createToken(req, res, next) {
    data.secret_key = secret_key;
    const private_key = fs.readFileSync('./RSA/private_key.pem');
    var token = "";
    token = await sign(data, private_key, { expiresIn: '1440 m' });

    return token;
}

module.exports = createToken;