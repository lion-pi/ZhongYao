const API_KEY = '4NShhfYNInpHtL5aPTdBP44U';
const SECRET_KEY = 'hZTCmMeekybFBEMksRNNHhvh3oR8tlt7';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer =  require('multer')
const express=require('express')
const app= express()
var cors =require("cors")


app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

async function getAccessToken() {
    const tokenRes = await fetch(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`
    );
    return (await tokenRes.json()).access_token;
}

app.post('/classify', upload.single('image'), async (req, res) => {
    try {
        const imageBuffer = req.file.buffer.toString('base64');
        
        const access_token = await getAccessToken();
        
        const apiRes = await fetch('https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `access_token=${access_token}&image=${encodeURIComponent(imageBuffer)}`
        });

        const data = await apiRes.json();
        res.json({ 
            keyword: data.result?.[0]?.keyword || '未知物品'
        });
        
    } catch (error) {
        console.error('服务端错误:', error);
        res.status(500).json({ error: '服务器处理失败' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`服务运行在 http://localhost:${PORT}`));