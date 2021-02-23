window.jQuery = function (selectorOrArrayOrTemplate) {    // 参数接收选择器或数组或元素模板
    let elements;    
    if (typeof selectorOrArrayOrTemplate === 'string') {    // 重载
        if (selectorOrArrayOrTemplate[0] === '<') {   // 此时是创建元素
            elements = [createElement(selectorOrArrayOrTemplate)];
        } else {    //  否则就是查找元素
            elements = document.querySelectorAll(selectorOrArrayOrTemplate);
        }  
    }else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate;
    } 

    function createElement(string){    //   创建元素方法
        const container = document.createElement("template");
        container.innerHTML = string.trim();
        return container.content.firstChild;
      }
    
    const api = Object.create(jQuery.prototype);   // 创建对象以参数里面的对象为原型
    
    Object.assign(api, {     //  给对象添加属性
        elements: elements,    // 保存当前获取的元素
        oldApi:selectorOrArrayOrTemplate.oldApi      //   保存上一层的api对象   end方法使用
    })
    return api;     
}
jQuery.prototype = {       //  把共用属性放在原型上面去
    constructor: jQuery,
    jquery: true,
    get(index){     //  获取指定元素
        return this.elements[index]
      },
    appendTo(node){     //  把当前元素添加到node元素里面去
        if(node instanceof Element){
            this.each(el => node.appendChild(el)) // 遍历 elements，对每个 el 进行 node.appendChild 操作
        }else if(node.jquery === true){    //  如果是一个jQuery对象
            this.each(el => node.get(0).appendChild(el))  // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
        }
    },
    append(children){      // 添加孩子节点
        if(children instanceof Element){
            this.get(0).appendChild(children)
        }else if(children instanceof HTMLCollection){
            for(let i = 0;i < children.length; i++){
            this.get(0).appendChild(children[i])
            }
        }else if(children.jquery === true){     //  如果是一个jQuery对象
            children.each(node => this.get(0).appendChild(node))
        }
    },
    addClass(className) {
        for (let i = 0; i < this.elements.length; i++){
            this.elements[i].classList.add(className);    // 闭包，函数访问了外部变量
        };
        return this;    //  this  就是 当前对象 以便链式操作
    },
    find(selector) {     //  查找元素
        let array = [];   //  找到前面的元素
        for (let i = 0; i < this.elements.length; i++){   //   根据上一层的范围中查找元素
           array = array.concat(Array.from(this.elements[i].querySelectorAll(selector)));  
        };
        array.oldApi = this;   // 保存当前的api，以便返回上一层
        return jQuery(array);     // 递归返当一个新的api  以便链式操作
    },
    end() {
        return this.oldApi;     //  返回上一层
    },
    parent() {    //  回到父级层
        const array = [];
        this.each(node => {
            if (array.indexOf(node.parentNode) === -1) {   //  相同父级只push一次
                array.push(node.parentNode);
            };
        });
        return jQuery(array);    //  返回父级元素的数组呗jQuery构造的api对象
    },
    children() {    // 获取孩子节点
        const array = [];
        this.each((node)=>{
            array.push(...node.children);   //  展开操作符
        })
        return jQuery(array);
    },
    each(fn) {   // 遍历元素
        for (let i = 0; i < this.elements.length; i++){
            fn.call(null, this.elements[i],i);
        }
        return this;
    },
    print() {   // 打印
        console.log(this.elements);
    }
}
window.$ = window.jQuery;    //  给jQuery取个别名 