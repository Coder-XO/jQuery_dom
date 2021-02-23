const x1 = jQuery('.test1').find('.child').each((node) => {console.log(node);}).parent().addClass('parent').find('.child').addClass('nini');
