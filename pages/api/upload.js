import fs from 'fs';
import nc from 'next-connect';
import multer from 'multer';
// import formidable from 'formidable';
// import slugify from 'slugify';
import path from 'path';

let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            console.log('desintation');
            return cb(null, path.join(process.cwd(), "public", "uploads"));        
        },
        filename: (req, file, cb) => {
            console.log('filename');
            const updatedName = new Date().getTime() + '-' + file.originalName;
            return cb(null, updatedName)
        }
    })
});

const handler = nc({
    onError: (err, req, res, next) => {
        console.log('onError');
        console.error(err.stack);
        res.status(500).end('Something broke!');
    },
    onNoMatch: (req, res, next) => {
        console.log('onNomatch');
        res.status(404).end('Page is not found');
    }
})
.use(upload.array('files'))
.post(async(req, res) => {
    console.log('post req.body: ', req.body);
    console.log('post req.transportCert: ', req.transportCert);
    console.log('post req.files: ', req.files);
    try {
        const session = await getSession({req});

        if (!session) {
            errorHandler('Access denied', res);
        } else {
            console.log('req.body: ', req.body);
            const userId = session.user.id;
            const url = req.file.filename;
            const slug = slugify(req.body.title, {
                remove: /[*+~.()'"!:0]/g                
            });
            const post = new Post({
                ...req.body,
                slug,
                image,
                user: userId
            });
        }
    } catch(error) {

    }
    console.log('end of post');
    res.status(201).json({body: req.body, file: req.file});
});

export const config = {
    api: {
        bodyParser: false
    }
}
const createProject = () => {
    return {
        name: 'Project 1',
        folder: 'project1'
    }
}

const createProjectPath = (project) => {
    return '../../apiProjects/project1';
}

// export default async function handler(req, res) {
//     const newProject = createProject();
//     const projectPath = createProjectPath(newProject);

//     fs.mkdir(projectPath, {recursive: true}, err => {
//         return console.log(err);
//     });

//     const data = await new Promise((resolve, reject) => {

//         console.log('upload.handler');
//         const form = formidable({
//             multiple: true,
//             uploadDir: projectPath
//         });
//         form.keepExtensions = true;
//         form.keepFileName = true;
//         form.on('fileBegin', (name, file) => {
//             console.log('fileBegin: name = ' + name);
//             console.log('fileBegin: file (' + (typeof file) + '): ', file);
//             const slugStr = slugify(file.originalFilename);
//             console.log('slugStr (' + (typeof slugStr) + '): ', slugStr);
//             console.log('projectPath (' + (typeof projectPath) + '): ', projectPath);
//             file.path = path.join(projectPath, slugify(file.name));
            
//         }) 
//         form.parse(req, async (err, fields, files) => {
//             console.log('fields: ', fields);
//             console.log('files: ', files);
//             if (err) return reject(err);
//             resolve(files);
//         })

//     });

//     return res.json(data);
// }

export default handler;