const API_KEY = '4NShhfYNInpHtL5aPTdBP44U';
const SECRET_KEY = 'hZTCmMeekybFBEMksRNNHhvh3oR8tlt7';

// 图片预览功能
document.getElementById('uploader').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        document.getElementById('preview').innerHTML = 
            `<img src="${e.target.result}" style="max-width:100%">`;
        classifyImage(e.target.result);
    }
    reader.readAsDataURL(file);
});

// 分类函数
async function classifyImage(base64Data) {
    // 获取Access Token
    const tokenRes = await fetch(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
    );
    const { access_token } = await tokenRes.json();

    // 发送识别请求
    const classifyRes = await fetch('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `access_token=${access_token}&image=${encodeURIComponent(base64Data.split(',')[1])}`
    });

    const data = await classifyRes.json();
    showResult(data.result[0].keyword);
}

// 显示结果
function showResult(keyword) {
    const mapping = {
        '塑料瓶': 'recycle',
        '果皮': 'food',
        '电池': 'hazard',
        '纸巾': 'other'
    };
    
    const type = mapping[keyword] || 'other';
    document.getElementById('result').innerHTML = `
        <div class="${type}">
            识别结果：${keyword}<br>
            分类：${type.toUpperCase()}
        </div>
    `;
}