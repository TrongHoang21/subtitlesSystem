const controller = {};
const models = require('../../models');
const Project = models.Project;


controller.getAll = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            attributes: ['id', 'projectName', 'subData', 'videoUrl', 'audioUrl', 'status', 'createdAt', 'updatedAt',
                            'audioStorageName', 'videoStorageName', 'exportVideoName', 'exportVideoUrl'],
            where: {
                userId: query.userId
            } //default
        };


        Project
            .findAll(options) 
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
};

controller.getProjectById = (query) => {
    return new Promise((resolve, reject) => {
        let options = {
            // attributes: ['id', 'projectName'],
            where: {
                id: query
            } //default
        };


        Project
            .findOne(options) 
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
};

controller.insertOne = (query) => {
    return new Promise((resolve, reject) => {
        let options = {     
            projectName: query.projectName ? query.projectName : "untitled",
            subData: query.subData ? query.subData : "",
            videoUrl: "",
            audioUrl: "",
            status: "Draft",
            videoStorageName:"",
            audioStorageName:"",
            exportVideoName:"",
            exportVideoUrl:"",
            userId: query.id 
        };

        
        Project
            .create(options)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.update = (query, newSubData) => {
    
    return new Promise((resolve, reject) => {
        let target = {where: {id: query.id}}
        let options = {}

        // uncomment để khi xóa hết sub thì lưu xóa hết sub
        // if(newSubData){
            options = {     
                projectName: query.projectName,
                subData: newSubData,
                videoUrl: query.videoUrl,
                audioUrl: query.audioUrl,
                status: query.status,
                videoStorageName: query.videoStorageName,
                audioStorageName: query.audioStorageName,
                exportVideoUrl: query.exportVideoUrl,
                exportVideoName: query.exportVideoName,
            };
        // }
        // else{
        //     // console.log('ProjectDAO: no subdata received');
        //     options = {     
        //         projectName: query.projectName,
        //         videoUrl: query.videoUrl,
        //         audioUrl: query.audioUrl,
        //         status: query.status,
        //         videoStorageName: query.videoStorageName,
        //         audioStorageName: query.audioStorageName,
        //         exportVideoUrl: query.exportVideoUrl,
        //         exportVideoName: query.exportVideoName,
        //     };
        // }
        


        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.updateVideoUrl = (queryId, videoUrl, videoStorageName) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: queryId}}
        let options = {     
            videoUrl: videoUrl,
            videoStorageName: videoStorageName,
        };

        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.updateAudioUrl = (queryId, audioUrl, audioStorageName) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: queryId}}
        let options = {     
            audioUrl: audioUrl,
            audioStorageName: audioStorageName,
        };

        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.updateVideoExportUrl = (queryId, exportVideoUrl, exportVideoName, status) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: queryId}}
        let options = {     
            exportVideoUrl: exportVideoUrl,
            exportVideoName: exportVideoName,
            status: status
        };

        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.updateProjectUserId = (queryId, userId) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: queryId}}
        let options = {     
            userId: userId,
        };

        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}

controller.changeProjectName = (projectId, newName) => {
    return new Promise((resolve, reject) => {
        let target = {where: {id: projectId}}
        let options = {     
            projectName: newName,
        };

        
        Project
            .update(options, target)  
            .then(data => resolve(data))
            .catch(error => reject(new Error(error)));


    });
}



//Since admin controller
controller.setUserIdForProjectToNull = (userId) => {
    return new Promise((resolve, reject) => {
        let options = {
            userId: null
        };

        let target = {where: {userId: userId}}

        Project
        .update(options, target)  
        .then((data) => resolve(data))  
        .catch(error => reject(error))  
    })
}

controller.getProjectList = () => {
    return Project.findAll();
}

controller.updateProject = (updateData) => {
    
    let target = {where: {id: updateData.id}}
    return Project.update(updateData, target)

}

controller.deleteProject = (projectId) => {
    return Project.destroy({
        where: {id : projectId}
    })
}

controller.getNullUserIdProjects = () => {
    return Project.findAll({
        attributes: ['id', 'createdAt', 'userId', 'videoStorageName'],
        where: {
            userId: null
        }
    });
}

module.exports = controller;