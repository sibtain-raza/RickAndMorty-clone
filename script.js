let page = [1,2];
let totalPages = 42;




async function fetchPage(){
    let characterToEpisode = []
    let episodeList = [] 
    let characters = []
    for(let j = 0;j<page.length;j++){
        let response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page[j]}`).then(response=>response.json()).then(article => article.results)
        characters = characters.concat(response);
    }
    for(let i = 0;i<characters.length;i++){
        let allEpisode = characters[i].episode;
        for(let j = 0;j<allEpisode.length;j++){
            let episodeNum = (+allEpisode[j].substr(allEpisode[j].length-2)?allEpisode[j].substr(allEpisode[j].length-2):allEpisode[j].substr(allEpisode[j].length-1))
            if (j == 0){               
                characterToEpisode.push([episodeNum])
            }else{
                characterToEpisode[characterToEpisode.length-1].push(episodeNum)
            }  
            episodeList.push(episodeNum)      
        }
    }

    let responseEpisode = await fetch(`https://rickandmortyapi.com/api/episode/${episodeList}`)
    let episodeInfo = await responseEpisode.json()
    let mappedEpisode = new Map(episodeInfo.map((element)=>[element.id,element]));

    // for(let  i = 0;i<characters.length;i++){
    //     let article = getArticle(characters[i],mappedEpisode,characterToEpisode)
    // }
    getArticle(characters,mappedEpisode,characterToEpisode)
}




function getArticle(characters,mappedEpisode,characterToEpisode){
    // console.log(firstSeen)
    let element = document.createElement('div')
    for(let  i = 0;i<characters.length;i++){
        //console.log(characters[i])
        let element = document.querySelector('.wrapper');
        let box = document.createElement("div")
        box.classList.add('box')
        element.appendChild(box)

        let modal = document.createElement("div")
        box.appendChild(modal)
        modal.classList.add('modal')
        box.onclick = function(){
            modal.style.display = "block";
        }
        let modalContent = document.createElement('div')
        modal.appendChild(modalContent)
        modalContent.classList.add('modal-content')

        let modalInnertext = document.createElement('p')
        for(let j = 0;j<characterToEpisode[i].length;j++){
            let episodeValue = mappedEpisode.get(+(characterToEpisode[i][j]))
            modalInnertext.innerHTML += `<h3>Id:${episodeValue.id}&nbsp&nbsp&nbsp&nbsp Name:${episodeValue.name}&nbsp&nbsp&nbsp&nbsp&nbsp Air-Date:${episodeValue.air_date}&nbsp&nbsp&nbsp&nbsp   Episode:${episodeValue.episode}</h3>` 
        }
        modalContent.appendChild(modalInnertext)
        modalInnertext.setAttribute('id',`modal-content${i+1}`)

        let image = document.createElement('img')
        box.appendChild(image)
        image.setAttribute('src',characters[i].image)
        image.classList.add('image')

        let content = document.createElement('div')
        box.appendChild(content)
        content.classList.add('content')

        let NameBox = document.createElement('div')
        content.appendChild(NameBox)
        NameBox.classList.add('Name','subBox')

        let Name =  document.createElement('a')
        NameBox.appendChild(Name)
        Name.setAttribute('target','_blank')
        Name.classList.add('name')
        Name.innerHTML = characters[i].name
        Name.setAttribute('href',`https://rickandmortyapi.com/api/character/${characters[i].id}`)
        Name.onclick = stopProp;
        
        let addline1 = document.createElement('br')
        NameBox.appendChild(addline1)


        let status = document.createElement('span')
        NameBox.appendChild(status)
        if(characters[i].status == "Alive"){
            status.classList.add('dotGreen');
        }else{
            status.classList.add('dotRed')
        }

        let statusSpecies = document.createElement('span')
        NameBox.appendChild(statusSpecies)
        statusSpecies.classList.add('live')
        statusSpecies.innerHTML = `${characters[i].status} - ${characters[i].species}`

        let locationBox = document.createElement('div')
        locationBox.classList.add('location','subBox')
        content.appendChild(locationBox)


        let locationText = document.createElement('span')
        locationBox.appendChild(locationText)
        locationText.classList.add('grey_text')
        locationText.innerHTML= 'Last known location'

        let addline2 = document.createElement('br')
        locationBox.appendChild(addline2)

        let location = document.createElement('a')
        locationBox.appendChild(location)
        location.setAttribute('href',characters[i].location.url)
        location.setAttribute('target','_blank')
        location.onclick = stopProp;
        location.classList.add('location_value')
        location.innerHTML = characters[i].location.name;

        let seenBox = document.createElement('div')
        content.appendChild(seenBox)
        seenBox.classList.add('seen','subBox')

        let seenText = document.createElement('span')
        seenBox.appendChild(seenText)
        seenText.classList.add('grey_text')
        seenText.innerHTML = 'First seen in:'

        let addline3 = document.createElement('br')
        seenBox.appendChild(addline3)

        let firstSeen = document.createElement('a')
        seenBox.appendChild(firstSeen)
        firstSeen.setAttribute('target','_blank')
        firstSeen.onclick = stopProp;
        firstSeen.classList.add('seen_value')
        firstSeen.innerHTML = mappedEpisode.get(+(characterToEpisode[i][0])).name
        firstSeen.setAttribute('href',`https://rickandmortyapi.com/api/episode/${+(characterToEpisode[i][0])}`)


    }


}

function stopProp(event){
    event.stopPropagation()
}

window.addEventListener('click',(event)=>{
    if(event.target.classList.contains('modal')){
        event.target.style.display = 'none'
    }
})



const scrollEl = document.querySelector('.wrapper')
let lastScrollTop = 0;

function onScroll(){
    const currentTop = scrollEl.scrollTop;
    const directin = currentTop > lastScrollTop ? 'down' : 'up';
    const distanceFromBottom = scrollEl.scrollHeight - currentTop;
    if(directin == 'down' && shouldLoadNextPage(distanceFromBottom)){
        
    }
}

window.addEventListener('scroll',()=>{
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100){
    }
    
}
)

fetchPage()