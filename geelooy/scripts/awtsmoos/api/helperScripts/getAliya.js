//B"H

function findMarkersInsections() {
    var sec = window?.post?.dayuh?.sections;
    if(!Array.isArray(sec)) return;

    var labels = [];
    var dp = new DOMParser()
    sec.forEach((q, i)=>{
        var p = dp.parseFromString(q,"text/html")
        var spans = Array.from(p.querySelectorAll("span"))
        spans.forEach(s=>{
            //console.log(s.style.color)
            if(
                s.textContent && 
                s.style.color.trim()=="rgb(1, 98, 0)"
            ) {
                labels.push({html:s.innerHTML, section: i})
            }
        })
    })
    return labels;
}
export {
  findMarkersInsections

}
