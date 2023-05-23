const { response } =  require('express');
const Comment = require('../models/comment');
const { Place, User } = require('../models');
const { findByIdAndUpdate } = require('../models/category');

// OBTENER TODOS LOS COMENTARIOS
// const getComments = async (req, res = response) => {
    
//         try {
//             const comments = await Comment.find();
//             const commentsCount = await Comment.countDocuments();
    
//             return res.status(200).json({
//                 ok: true,
//                 msg: 'Lista general de comentarios',
//                 comments,
//                 commentsCount
//             });
//         } catch (error) {
//             console.log(error);
//             return res.status(500).json({
//                 ok: false,
//                 msg: 'Ah ocurrido un error, contacte al administrador'
//             });
//         }
    
// }

const getComments = async (req, res = response) => {

    
        const { id } = req.params;

        if (id === '' || id === undefined) {
            return res.status(400).json({
                ok: false,
                msg: 'El id es obligatorio'
            });
        }
    
        try {
            const comment = await Comment.find({place: id})
                .populate('user')
            const commmetCount = await Comment.find({place: id}).countDocuments();
            
            if (!comment) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El comentario no existe'
                });
            }   
            if (comment.length === 0) {
                const newCommet = Comment({text: 'No hay comentarios para este lugar', user: User(), place: id});
                comment.push(newCommet);
                return res.status(404).json({
                    ok: true,
                    msg: 'No hay comentarios para este lugar',
                    comment,
                    commmetCount
                });
            }
    
            return res.status(200).json({
                ok: true,
                msg: 'Comentario encontrado',
                comment,
                commmetCount
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok: false,
                msg: 'Ah ocurrido un error, contacte al administrador'
            });
        }
    
}

const postComment = async (req, res = response) => {

            const { text, userId, placeId } = req.body;

            if (!text || text === '') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El texto es obligatorio'
                });
            }

            if (!userId || userId === '') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario es obligatorio'
                });
            }

            if (!placeId || placeId === '') {
                return res.status(400).json({
                    ok: false,
                    msg: 'El lugar es obligatorio'
                });
            }
        
            try {
                
                const place = await Place.findById(placeId);
                const user = await User.findById(userId);
                
                if (!place) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'El lugar no existe'
                    });
                }

                if (!user) {
                    return res.status(404).json({
                        ok: false,
                        msg: 'El usuario no existe'
                    });
                }

                const comment = new Comment({text, user, place});
                let commentNumber = parseInt(place.comments);
                commentNumber += 1;
                place.comments = commentNumber.toString();
                await comment.save();
                console.log(await Place.findOneAndUpdate(placeId, {comments: place.comments},{ new: true }));
            
        
                return res.status(200).json({
                    ok: true,
                    msg: 'Comentario creado',
                    comment
                });
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    ok: false,
                    msg: 'Ah ocurrido un error, contacte al administrador'
                });
            }
        
}

const putComment = async (req, res = response) => {
    
        const { id } = req.params;
        const { text } = req.body;
    
        if (text === '' || text === undefined) {
            return res.status(400).json({
                ok: false,
                msg: 'El texto es obligatorio'
            });
        }
    
        try {
    
            const comment = await Comment.findById(id);
    
            if (!comment) {
                return res.status(404).json({
                    ok: false,
                    msg: 'El comentario no existe'
                });
            }
    
            comment.text = text;
            await comment.save();
    
            return res.status(200).json({
                ok: true,
                msg: 'Comentario actualizado',
                comment
            });
    
        } catch (error) {
            console.log(error);  
            return res.status(500).json({
                ok: false,
                msg: 'Ah ocurrido un error, contacte al administrador'
            }); 
        }
}

const deleteComment = async (req, res = response) => {

    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);
        
        if (!comment) {
            return res.status(404).json({
                ok: false,
                msg: 'El comentario no existe'
            });
        }

        await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            ok: true,
            msg: 'Comentario eliminado'
        });

    } catch (error) {
        console.log(error);  
        return res.status(500).json({
            ok: false,
            msg: 'Ah ocurrido un error, contacte al administrador'
        }); 
    }

}

module.exports = {
    getComments,
    postComment,
    putComment,
    deleteComment
}