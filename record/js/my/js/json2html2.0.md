```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>tree dom plugin</title>
    <style>
        *{margin: 0;padding: 0;}
    .side{width:300px;border: 1px solid #eeee;min-height:600px;background: beige;padding: 10px;}
    ul{list-style: none;}
    .treeGroup{margin-left: 20px;border-left: 1px solid #c1bebe;user-select: none;}
    .treeGroup.root{border-bottom:1px solid #c1bebe; }
    li .text:before{content:"-";color:#c1bebe}
    .on>.treeGroup{display: block}
    .off>.treeGroup{display: none}
    /* .red{color: #f00} */
@font-face {
  font-family: 'iconfont';  /* project id 1092643 */
  src: url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.eot');
  src: url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.woff2') format('woff2'),
  url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.woff') format('woff'),
  url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.ttf') format('truetype'),
  url('//at.alicdn.com/t/font_1092643_eitp1eqkb3.svg#iconfont') format('svg');
}
.iconfont{
    font-family:"iconfont" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    color: #6b6767;
    }
    </style>
 
</head>
<body>
    <div class="side">
        <div class="treeRoot">

        </div>
    </div>
    <script src="./plugin/data.js"></script>
    <script>
    var source = data.data;
        var rootArr = [];
        rootArr = source.filter(item => {
            if (!item.parentId) {
                return item;
            }
        });
        function setChildren(arr, tarArr) {
            if (arr) {
                arr.forEach(item => {
                    item.children = [];
                    if (tarArr) {
                        tarArr.forEach(tar => {

                            if (tar.parentId && item.subjectId === tar.parentId) {
                                item.children.push(tar);
                            }
                        });

                    }
                    if (item.children.length > 0) {


                        setChildren(item.children, tarArr)
                    } else {
                        delete item.children
                    }


                });
            }

        }
        setChildren(rootArr, source);

        function createFragMent(tData) {
            var rootFrag = document.createDocumentFragment();
            var rootUL = document.createElement("ul");
            rootUL.className='treeGroup '

            var _html =''
            tData.forEach(item=>{

                var oli = document.createElement('li');
                oli.className ='off';
                oli.dataset.statu = 0;
                var liHTML='';

               if(item.children){
                   var chilFragMENT = document.createDocumentFragment();
                   var titDiv =  document.createElement("div");
                   titDiv.className='text red iconyousanjiao1  ';
                   titDiv.innerHTML ='<i class="iconfont">&#xe629;</i>'+  item.subjectName;
                   
                   chilFragMENT.appendChild(titDiv)
                   chilFragMENT.appendChild(createFragMent(item.children))

                   oli.appendChild(chilFragMENT)
                    
               } else{

                liHTML=` <div class="text">${item.subjectName}</div> `;

               oli.innerHTML = liHTML;
               }

               rootUL.appendChild(oli);
                
            });

            rootFrag.appendChild(rootUL)

            return rootFrag;
        }
    
     document.querySelector(".treeRoot").appendChild(createFragMent(rootArr))
    // treeCon.appendChild(fment)
    var deepTree =[
        { subjectName:"item-1"},
        { subjectName:"item-2"},
        { subjectName:"item-3",
            children:[
                { subjectName:'item-3-1'},
                { subjectName:'item-3-2'},
                { subjectName:'item-3-3'},
                { subjectName:'item-3-4',
                    children:[
                        { subjectName:'item-3-4-1'},
                        { subjectName:'item-3-4-2',
                            children:[
                                {subjectName:'item-3-4-2-1'},
                                {subjectName:'item-3-4-2-2'},
                                {subjectName:'item-3-4-2-3'},
                                {subjectName:'item-3-4-2-4',
                                    children:[
                                        {subjectName:'item-3-4-2-4-1'},
                                        {subjectName:'item-3-4-2-4-2'},
                                        {subjectName:'item-3-4-2-4-3'},
                                        {subjectName:'item-3-4-2-4-4'},
                                    ]
                                },
                            ]
                        },
                        { subjectName:'item343'},
                    ]
                },
            ]
        },
        { subjectName:"item4"},
    ]

       createFragMent(rootArr)
        var treeCon = document.querySelector(".treeRoot");
        var fment = createFragMent(deepTree)
         treeCon.appendChild(fment)

         var olis = document.querySelectorAll('li');
         for (let i = 0; i < olis.length; i++) {
             const li = olis[i];
             li.onclick = function (e) {
                 e.preventDefault();
                  e.stopPropagation();
                 this.classList.toggle('off');

                 var oliStatu = this.dataset.statu;
                 var oi = this.querySelector("i");
                 //&#xe65a; open
                 //&#xe629; close
                 if(oliStatu==0){
                    oi.innerHTML ='&#xe65a;'
                 }else{
                     oi.innerHTML = '&#xe629;'
                 }
                this.dataset.statu= 1- oliStatu
             }
             
         }
    </script>
</body>
</html>

```
