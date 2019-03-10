
## js
```
        
        function createDOMTree(par) {
            var OutFragMent = document.createDocumentFragment();
            if(par){
                var parFrag=document.createDocumentFragment();
                par.forEach(item=>{
                    var domItem = document.createElement('div');
                    domItem.className = 'pr_node';

                    var chidFrag=document.createDocumentFragment();
                    
                    if(item.children){

                        var domChild=document.createElement('div');
                        domChild.className='sun_node';
                        domChild.innerHTML= createDOMTree(item.children);
                        chidFrag.appendChild(domChild);
                         
                    }else{
                        item.innerHTML=`<div class="text">父节点名称2</div>`;
                        
                    }
                    domItem.appendChild(chidFrag)
                    parFrag.appendChild(domItem)
                });

                OutFragMent.appendChild(parFrag)
           
                return OutFragMent;
            }
        }
        var OutFragMent = document.createDocumentFragment();
        
        var renderHtml = createDOMTree(rootArr);
        OutFragMent.appendChild(renderHtml)
        console.log(renderHtml)



```
### html,css
```
    .pr_node{padding-left: 20px;}
    .sun_node{padding-left: 20px;}
    .text{border:1px solid #eee;padding: 2px ; }
    
       <div id="root">
        <div class="treeRoot">
            <div class="pr_node">
                <div class="text">父节点名称</div>
                <div class="sun_node">
                    <div class="text">子节点名字</div>
                    <div class="pr_node">
                        <div class="text">父节点名称2</div>
                        <div class="sun_node">
                            <div class="text">子节点名字2</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pr_node">
                <div class="text">父节点名称</div>
                <div class="sun_node">
                    <div class="text">子节点名字</div>
                    <div class="pr_node">
                        <div class="text">父节点名称2</div>
                        <div class="sun_node">
                            <div class="text">子节点名字2</div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

```
