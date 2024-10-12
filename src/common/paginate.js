module.exports = (total_pages, current_page, pathName) => {
    const delta     = 2;
    const left      = current_page - delta;
    const right     = current_page + delta;
    const paging_collection = [];

    if (current_page > 1) {
        paging_collection.push({ 
            name: '\u00AB', 
            url: pathName + '?page=' + Number(current_page - 1),
            is_current: 0
        })
    }

    for( i = 1; i <= total_pages; i++) {                
        
        if (
            i === current_page ||
            i === 1 ||
            i === total_pages ||
            (i >= left && i <= right)
        ) {
            paging_collection.push({ 
                name: i, 
                url: pathName + '?page=' + i ,
                is_current : ( i === current_page ) ? 1 : 0
            })
        } 
        else if (
            i === left - 1 ||
            i === right + 1
        ){
            paging_collection.push({ 
                name: '...', 
                url: pathName + '?page=' + i ,
                is_current : ( i === current_page ) ? 1 : 0
            })
        }
    }

    if (current_page < total_pages) {
        paging_collection.push({ 
            name: '\u00BB', 
            url: pathName + '?page=' + Number(current_page + 1),
            is_current : 0
        })
    }

    return paging_collection
    // [1... 3, 4, 5, 6 ,7,... 10]
}