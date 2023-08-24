const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { parse } = require('dotenv');


//Routes

//get method for home route.
router.get('', async (req, res) => {



 try{ 
    const locals = {
        title: "My Blog",
        description: "My first simple blog website"
     }
     let perPage = 10;
     let page = req.query.page || 1;
      
     const data = await Post.aggregate([ {$sort: { createdAt: -1}}])
     .skip(perPage * page - perPage)
     .limit(perPage)
     .exec();

     const count = await Post.count();
     const nextPage = parseInt(page) + 1;
     const hasNextPage = nextPage <= Math.ceil(count / perPage);


    res.render('index', { 
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
        });
    
 }catch(error){ 
   console.log(error);
 }
});

/* GET 
Post: id 
*/

router.get('/post/:id', async (req, res) => {


    try{ 
    
         let slug =req.params.id;
        
       const data = await Post.findById( {_id: slug});

       const locals = {
        title: data.title,
        description: "My first simple blog website"
     }

       res.render('post', { locals, data, currentRoute: `/post/${slug}`});
       
    }catch(error){ 
      console.log(error);
    }
   });

   /* POST 
   Post - searchTerm 
   */

   router.post('/search', async (req, res) => {
    try{ 
    const locals = {
       title: "Search",
       description: "My first simple blog website"
    }
   let searchTerm = req.body.searchTerm;
   const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, ""); 
   
       const data = await Post.find({
        $or: [
          {title: {$regex: new  RegExp(searchNoSpecialChar, 'i')}},
          {body: {$regex: new  RegExp(searchNoSpecialChar, 'i')}},
       
        ]
       });


       res.render('search', { locals, data});
       
    }catch(error){ 
      console.log(error);
    }
   });


   router.get('/about', (req, res) => {
    res.render('about', {
      currentRoute: '/about'
    });
    
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
  
});


// router.get('', async (req, res) => {

//     const locals = {
//        title: "My Blog",
//        description: "My first simple blog website"
//     }
   
//     try{ 
//        const data = await Post.find();
//        res.render('index', { locals, data});
       
//     }catch(error){ 
//       console.log(error);
//     }
//    });


//  async function insertPostData () {
//     try {
//          const postsToInsert = [
//         {
//             title:  "Building a blog",
//             body: "This is the body text"
//         },
//         {
//             title:  "Test 1",
//             body: "This is the body text for test 1"
//         },
//         {
//             title:  "Test 2",
//             body: "This is the body text for test 2"
//         },
//         {
//             title:  "Test 3",
//             body: "This is the body text for test 3"
//         },
//     ];
//     const insertedPosts = await Post.create(postsToInsert);
//     console.log(`${insertedPosts.length} posts inserted`);
// } catch (error) {
//   console.log('Error inserting posts', error)
// }
//  }
// insertPostData();




module.exports = router;