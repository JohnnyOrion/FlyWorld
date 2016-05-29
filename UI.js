/*******************UI.js, Comfort UI, Peter Fedorko, 2016**************************/
/*******************Call following in html document *****************************/
//  <script>
//         InitStraight(document.body);
//  </script>
//  </body>
/*******************gUI object is now available, namespace safe to do later.************/

function CUiInstructor() {

    this.m_aResolvedElements = new Array();
    this.m_aResolvingClasses = ["slider", "spinner"];
    this.m_pMainForm = { m_bIsDoc: true, m_pTargetedDOM: null };
    this.m_pAnEntered = null;
    this.m_pAnLeft = null;
    this.m_pSafe = null;
    this.m_iLeft = 0;
}

CUiInstructor.prototype.LoadDoms = function (rootdom) {


    var elemcount = rootdom.children.length;
    var elems = rootdom.children;
    for (var i=0;i<elemcount;i++)
    {
        var el = elems[i];
        //check el
        this.CheckEl(el);
        this.LoadDoms(el);
    
    }

}

CUiInstructor.prototype.CheckEl = function (elem) {

    var cnt = this.m_aResolvingClasses.length;
    var thetype = elem.getAttribute("ui_class");
    if (thetype == undefined)
        return;
    var examine = thetype.toLowerCase();


    if (examine==="slider")
    {
           
        var controlname = elem.getAttribute("variablename");
        if (controlname!=undefined)
            if (controlname!="")
            {
                this.m_pMainForm[controlname] = new CSlider();
                this.m_pMainForm[controlname].AttachUp(elem);
                this.m_pMainForm[controlname].ConstructUp();
            }
           
    }

}
CUiInstructor.prototype.MouseMove = function (e) {
    //var e = window.event; //alert(ev.buttons);
    var buttonis = e.buttons;

    if (window.event !== undefined) {
        buttonis = buttonis | window.event.button;
    }
  
    if ((buttonis & 1) != 1) {
        //has not entered/moved with press
        gUI.m_pMainForm.m_pTargetedDOM = null;
    }

    if (gUI.m_pMainForm.m_pTargetedDOM != null)
    {
        var owner = gUI.m_pMainForm.m_pTargetedDOM.m_pOwner;
        if (owner.m_sType === "slider") {
            if (owner.m_iDownedXS > -1) {
                var x = e.screenX - owner.m_iDownedXS;
                var slidie = owner.GetControl("slidie", null);
                var atpos =  owner.m_iDownedLength + x;
                if (atpos < 0)
                {
                    atpos = 0;
                }
                if (atpos > owner.m_iLength)
                {
                    atpos = owner.m_iLength;
                }

                var oldpos=owner.m_iPosition;
                owner.m_iPosition = parseInt(atpos * owner.m_iCount / owner.m_iLength);
                owner.m_iDerivate= owner.m_iPosition - oldpos; 
                if (owner.m_iDerivate !== 0) {
                    owner.Adjust();
                    if (owner.m_fOnChanged != null)
                        owner.m_fOnChanged(owner);
                }
            }
        }
    }

}
CUiInstructor.prototype.MouseUp = function (e) {
    if (gUI.m_pMainForm.m_pTargetedDOM != null) {
        gUI.m_pMainForm.m_pTargetedDOM = null;
    }
}


var gUI = null;
function Init(objid)
{
    gUI = new CUiInstructor();
    gUI.LoadDoms(document.getElementById(objid));
    document.body.addEventListener('mousemove', gUI.MouseMove, true);
    document.body.addEventListener('mouseup', gUI.MouseUp, true);

    LoopUp();
}
function InitStraight(obj) {
    gUI = new CUiInstructor();
    gUI.LoadDoms(obj);
    document.body.addEventListener('mousemove', gUI.MouseMove, true);
    document.body.addEventListener('mouseup', gUI.MouseUp, true);

    LoopUp();
}


window.requestAnimFrameC = function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame     || 
        function( callback){
            window.setTimeout(callback, 1000 / 50);
        }
    );
}();

function LoopUp()
{
   

    window.requestAnimFrameC(LoopUp);
}



/*----------------------------------------CSlider class----------------------------------------------*/
function CSlider()
{
    this.m_pDOMObj = null;
    this.m_sType="slider";
    this.m_iPosition = 0;//should be a setter, but comes handy as public too
    this.m_iCount = 0;
    this.m_fMin = -1.0;
    this.m_fMax = 1.0;
    this.m_fOnChanged = null;//appears if a value is altered- slidie moved
    this.m_fOnEstablished = null;
    /*private*/
    this.m_iLength = 0;
    this.m_iLengthPos = 0;
    this.m_iDerivate = 0;//amount from previous m_iPosition
    this.m_iDownedXS = -1;
    this.m_iDownedLength = -1;
}
CSlider.prototype.GetPosition = function () {
    return this.m_iPosition;
}
CSlider.prototype.SetPosition = function (pos) {
    this.m_iPosition = parseInt(pos);//dumb resitant more
    this.Adjust();
}
CSlider.prototype.AttachUp = function (domobj)
{
    this.m_pDOMObj = domobj;
}
CSlider.prototype.GetValueAbstract = function () {
    var theval = this.m_fMin+(this.m_fMax - this.m_fMin) * (this.m_iPosition/(this.m_iCount+1));
    return theval;
}
CSlider.prototype.ConstructUp = function () {
  
    var utfuri=encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='20px' width='10px'><text x='0' y='15' fill='red' font-size='20px'>&lt;</text></svg>");
   // var thething = "<div att_nm=\"left\" style=\"border: solid 0px red;max-width:32px;width:10%;height:inherit;float:left;position:relative;background:no-repeat center center url(&quot;data:image/svg+xml;utf8," + utfuri + "&quot);\">l</div>";
   // var bs = Base64.encode("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='20px' width='10px'><text x='0' y='15' fill='red' font-size='20px'>&lt;</text></svg>");
    var bs = Base64.encode('<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#00aa00"><path d="M 429.568,184.688l0.00,142.624 L 256.512,327.312 l0.00,102.256 L 82.432,256.00l 174.08-173.568l0.00,102.256 M 512.00,256.00 c0.00-141.392-114.608-256.00-256.00-256.00S0.00,114.608,0.00,256.00s 114.608,256.00, 256.00,256.00S 512.00,397.392, 512.00,256.00z" ></path></svg>');
    var thething = "<div att_nm=\"left\" style=\"border: solid 0px red;width:10%;height:inherit;float:left;position:relative;background: no-repeat center center url(data:image/svg+xml;base64," + bs + ");\"></div>";

     

    thething += "<div att_nm=\"slider\"  style=\"width:80%;height:inherit;float:left;background-color:grey;\">";
    bs = Base64.encode('<svg width="20.0" height="20" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" fill="#00aa00"><path d="M 425.00,25.00l-55.00,0.00 C 356.20,25.00, 350.00,36.20, 350.00,50.00l0.00,425.00 l 100.00,0.00 L 450.00,50.00 C 450.00,36.20, 438.825,25.00, 425.00,25.00z M 275.00,175.00L 220.00,175.00 C 206.20,175.00, 200.00,186.20, 200.00,200.00l0.00,275.00 l 100.00,0.00 L 300.00,200.00 C 300.00,186.20, 288.825,175.00, 275.00,175.00z M 125.00,325.00L 70.00,325.00 C 56.20,325.00, 50.00,336.175, 50.00,350.00l0.00,125.00 l 100.00,0.00 l0.00-125.00 C 150.00,336.175, 138.80,325.00, 125.00,325.00z" ></path></svg>');
    thething += "<div att_nm=\"slidie\" style=\"width:40px;height:inherit;float:left;position:relative;background: no-repeat center center blue url(data:image/svg+xml;base64," + bs + ");\"></div></div>";
    bs = Base64.encode( '<svg width="20" height="20" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#00aa00"><path d="M 82.432,327.312l0.00-142.624 l 173.04,0.00 L 255.472,82.432 L 429.568,256.00l-174.08,173.568l0.00-102.256 M0.00,256.00 c0.00,141.392, 114.608,256.00, 256.00,256.00s 256.00-114.608, 256.00-256.00S 397.392,0.00, 256.00,0.00S0.00,114.608,0.00,256.00z" ></path></svg>');
    thething += "<div att_nm=\"right\"  style=\"width:10%;height:inherit;float:right;background: no-repeat center center url(data:image/svg+xml;base64," + bs + ");\"></div>";
    this.m_pDOMObj.innerHTML = thething;


    this.m_iCount =parseInt(this.m_pDOMObj.getAttribute("ui_count"))-1;
    this.m_iPosition = parseInt(this.m_pDOMObj.getAttribute("ui_position"));

    this.m_fMin = this.m_pDOMObj.getAttribute("ui_min");
    this.m_fMax = this.m_pDOMObj.getAttribute("ui_max");

    if (/[\.,]/.test(this.m_fMin))
    {
        //is float
    }
    else
    {

    }

    control = this.GetControl("slider");
    var controlsl= this.GetControl("slidie");
    this.m_iLength = control.getBoundingClientRect().width-parseInt(controlsl.getBoundingClientRect().width);

    var gfuncname = this.m_pDOMObj.getAttribute("ui_onchanged");
    this.m_fOnChanged = window[gfuncname];
    if (this.m_fOnChanged === undefined)
        this.m_fOnChanged = null;   // my silly ways

    gfuncname = this.m_pDOMObj.getAttribute("ui_onestablished");
    this.m_fOnEstablished = window[gfuncname];
    if (this.m_fOnEstablished === undefined)
        this.m_fOnEstablished = null; // my silly ways

    this.MakeEvents();

    this.Adjust();

    if (this.m_fOnEstablished !== null)
        this.m_fOnEstablished(this);
}
CSlider.prototype.GetControl = function (att_nm,el) {
    if (el === undefined)
        el = this.m_pDOMObj;
    if (!el)
        el = this.m_pDOMObj;
    if (el === null)
        el = this.m_pDOMObj;
    var elemcount = el.children.length;
    var elems = el.children;
    for (var i = 0; i < elemcount; i++) {
        var rel = elems[i];
        //check el
        if (rel.getAttribute("att_nm") === att_nm)
            return rel;
        rel = this.GetControl(att_nm, rel);
        if (rel !== undefined)
            return rel;
    }
}
CSlider.prototype.Adjust = function () {
    var slidie = this.GetControl("slidie", null);
    this.m_iLengthPos = parseInt((this.m_iLength / this.m_iCount) * this.m_iPosition);
    slidie.style.left = this.m_iLengthPos + 'px';
}

CSlider.prototype.MouseIsDownSlidie = function (e) {
    // if (!e) var e = window.event;

    owner = e.target.m_pOwner;
    gUI.m_pMainForm.m_pTargetedDOM = e.target;// only a single dom object can be targeted prior eventualy- right

    owner.m_iDownedXS = e.screenX;
    owner.m_iDownedLength = owner.m_iLengthPos;
    e.stopPropagation(); // 
    e.preventDefault(); // default browser actions
   // document.getElementById("dbg").innerHTML += "m" + e.button;
}
CSlider.prototype.MouseIsUpLeft = function (e) {

    owner = e.target.m_pOwner;
    
        if (owner.m_iPosition > 0)
    {
        owner.m_iPosition = owner.m_iPosition - 1;
        owner.Adjust();
        owner.m_fOnChanged(owner);
    }

    e.stopPropagation(); // 
    e.preventDefault(); // default browser actions
}
CSlider.prototype.MouseIsUpRight = function (e) {

    owner = e.target.m_pOwner;

    if (owner.m_iPosition < owner.m_iCount)
        {
            owner.m_iPosition = owner.m_iPosition + 1;
        owner.Adjust();
        owner.m_fOnChanged(owner);
    }
 
    e.stopPropagation(); // 
    e.preventDefault(); // default browser actions
}
CSlider.prototype.MouseD = function (e) {
    e.stopPropagation(); // 
    e.preventDefault(); // default browser actions
   
}
CSlider.prototype.MakeEvents = function () {
    var slidie = this.GetControl("slidie", null);
    slidie.m_pOwner = this;
  //  slidie.addEventListener('mousedown', this.MouseD, false);// not bubbling, capturing 
    slidie.addEventListener('mousedown', this.MouseIsDownSlidie, false); // bubbling
 //   slidie.addEventListener('mousemove', this.MouseIsMovedSlidie, false); // bubbling, capturing has set the values to conform already
    //  document.body.addEventListener('mousemove', this.MouseIsMovedSlidie, true);//capturing // put to gui global

    var left = this.GetControl("left", null);
    left.m_pOwner = this;
    left.addEventListener('mouseup', this.MouseIsUpLeft, false); // bubbling
    left.addEventListener('mousedown', this.MouseD, false);// not bubbling, capturing 

    var right = this.GetControl("right", null);
    right.m_pOwner = this;
    right.addEventListener('mouseup', this.MouseIsUpRight, false); // bubbling
    right.addEventListener('mousedown', this.MouseD, false);// not bubbling, capturing 
}



/*------------------------------------------base encode-----------------------------------------------*/
var Base64 = {
    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
            Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
            Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = Base64._keyStr.indexOf(input.charAt(i++));
            enc2 = Base64._keyStr.indexOf(input.charAt(i++));
            enc3 = Base64._keyStr.indexOf(input.charAt(i++));
            enc4 = Base64._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }
        return string;
    }
}

