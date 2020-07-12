function dataURLtoBlob (dataurl) {
	var arr = dataurl.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), // 二进制文件流
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new Blob([u8arr], {
		type: mime
	})
}

function downloadFile (url, name = '打印') {
	var a = document.createElement("a")
	a.setAttribute("href", url)
	a.setAttribute("download", name)
	a.setAttribute("target", "_blank")
	let clickEvent = document.createEvent("MouseEvents")
	clickEvent.initEvent("click", true, true)
	a.dispatchEvent(clickEvent)
}

// base64编码文件下载
function downloadFileByBase64 (base64, name) {
	var myBlob = dataURLtoBlob(`data:application/pdf;base64,${base64}`)
	// var myBlob = dataURLtoBlob(base64);
	var myUrl = URL.createObjectURL(myBlob)
	downloadFile(myUrl, name)
}

export default downloadFileByBase64
