import accounting from 'accounting';
import Md5 from "md5.js";
import Mock from "@/mock/approval";


let qianfenwei = (num) => {
    //js浮点数相乘运算精度不准确,建议用mul方法计算浮点数相乘
    // return accounting.formatMoney(Math.floor(num * 100) / 100,'');
    return accounting.formatMoney(Math.floor(Number(num).mul(100)) / 100,'');
}

let fixed = (num) => {
    num = parseFloat(num);
    return num.toFixed(2);
}

let getLocalTime = (params, flag) => {
    params = new Date(params)
    var year = params.getFullYear();
    if (year === 1970) return;
    var month = params.getMonth() + 1;
    var date = params.getDate();
    var hour = params.getHours();
    var minute = params.getMinutes();
    var second = params.getSeconds();
    if (flag === 1) {
        return year + "-" + addZero(month) + "-" + addZero(date) + " " + addZero(hour) + ":" + addZero(minute) + ":" + addZero(second);
    } else {
        return year + "-" + addZero(month) + "-" + addZero(date);
    }

}

let addZero = (params) => {
    return params.toString().length > 1 ? params.toString() : '0' + params.toString();
}
let formatDate = (n) => {
    //格式化日期
    if(n) {
        let date = n.toString().replace(/-/g, '/')
        var oDate = new Date(date);
        return oDate.getFullYear() + '-' +toDou((oDate.getMonth() + 1))  + '-' + toDou(oDate.getDate());
    }else{
        return '--';
    }
}
let toDou = (n) => {
        return n < 10 ? '0' + n : n;
    }
    /**
     ** 乘法函数，用来得到精确的乘法结果
     ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
     ** 调用：accMul(arg1,arg2)
     ** 返回值：arg1乘以 arg2的精确结果
     **/
let accMul = (arg1, arg2) => {

    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {}
    try {
        m += s2.split(".")[1].length
    } catch (e) {}
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

}

/**
   除法
**/
let division = (num1, num2) => {

        var s1 = num1.toString(),
            s2 = num2.toString();
        var len1 = 0;
        var len2 = 0;
        var currNum = 0;
        if (s1.indexOf('.') != -1) {
            len1 = s1.split(".")[1].length;
        }
        if (s2.indexOf('.') != -1) {
            len2 = s2.split(".")[1].length;
        }
        currNum = len1 > len2 ? len1 : len2;
        return accMul(num1, Math.pow(10, currNum)) / accMul(num2, Math.pow(10, currNum));


    }
    /*
     * @ 处理浮点型数据的加法运算
     * @ autor   flxu
     * @ eg：additFn(1.4000000,2.7890000,3.9800000,2.6000000,4.2310000,0.1000000,0.1000000,0.1000000,0.1000000,0.1000000,0.1000000)
     */
let additFn = () => {
        if (arguments.length == 0) {
            return 0;
        }
        if (arguments.length == 1) {
            return arguments[0];
        } else {
            var nLen = arguments.length;
            var maxLen = 0;
            var intSum = 0;
            var decimalSum = 0;
            for (var i = 0; i < nLen; i++) {
                var aNum = (arguments[i] + '').split('.');
                var nInt = Number(aNum[0] ? aNum[0] : 0);
                var sDecimal = aNum[1] ? aNum[1] : '';
                var nDecimal = Number(sDecimal);
                intSum += nInt;
                var decimalLen = sDecimal.length;
                if (decimalLen < maxLen) {
                    nDecimal = nDecimal * Math.pow(10, maxLen - decimalLen);
                } else if (decimalLen > maxLen) {
                    decimalSum = decimalSum * Math.pow(10, decimalLen - maxLen);
                    maxLen = decimalLen;
                }
                decimalSum += nDecimal;
            }
            return (intSum * Math.pow(10, maxLen) + decimalSum) / Math.pow(10, maxLen);
        }
    }
  //获取sign,暂不支持params是字符串,用前先验证
  let getSign = (params, bizId) => {
    if (typeof params == "string") {
        return paramsStrSort(params, bizId);
    } else if (typeof params == "object") {
        var arr = [];
        for (var i in params) {
          if(i != 'bizId') {
            arr.push((i + "=" + params[i]));
          }
        }
        arr.push(Mock.signDefault);
        return paramsStrSort(arr.join(("&")), bizId);
    }
  }
  
  let paramsStrSort = (paramsStr, bizId) => {
    var url = paramsStr;
    var urlStr = url.split("&").sort().join("&");
    var newUrl = urlStr + '&key=' + bizId;
    let res = new Md5().update(newUrl).digest('hex');
    return res;
  }
    // 给Number类型增加一个mul方法，调用起来更加方便。
Number.prototype.mul = function(arg) {
    return accMul(arg, this);
};

export default {
    qianfenwei: qianfenwei,
    fixed: fixed,
    getLocalTime: getLocalTime,
    addZero: addZero,
    toDou: toDou,
    formatDate: formatDate,
    division: division,
    accMul: accMul,
    additFn: additFn,
    getSign: getSign,
};