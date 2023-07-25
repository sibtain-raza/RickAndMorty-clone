let totalPages = 42;

const articleList = document.getElementById('article-list');
const articleListPagination = document.getElementById('article-list-pagination');
let page = 0;


function getPageId(n) {
	return 'article-page-' + n;
}



async function getArticlePage(page){
    let characterToEpisode = []
    let episodeList = [] 
    let response = await fetch(`https://rickandmortyapi.com/api/character/?page=${page}`)
    let Response = await response.json()
    let characters= Response.results

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
    let mappedEpisode = new Map(episodeInfo.map((result)=>[result.id,result]));
    let pageElement = document.createElement('div')
	pageElement.id = getPageId(page);
    pageElement.className = 'wrapper'
    for(let  i = 0;i<characters.length;i++){
        let article = getArticle(characters[i],mappedEpisode,characterToEpisode[i])
        pageElement.appendChild(article)
    }
    articleList.appendChild(pageElement)
}




function getArticle(character,mappedEpisode,characterToEpisode){

        let box = document.createElement("div")
        box.classList.add('box')

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
        for(let j = 0;j<characterToEpisode.length;j++){
            let episodeValue = mappedEpisode.get(+(characterToEpisode[j]))
            modalInnertext.innerHTML += `<h3>Id:${episodeValue.id}&nbsp&nbsp&nbsp&nbsp Name:${episodeValue.name}&nbsp&nbsp&nbsp&nbsp&nbsp Air-Date:${episodeValue.air_date}&nbsp&nbsp&nbsp&nbsp   Episode:${episodeValue.episode}</h3>` 
        }
        modalContent.appendChild(modalInnertext)

        let image = document.createElement('img')
        box.appendChild(image)
        image.setAttribute('src',character.image)
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
        Name.innerHTML = character.name
        Name.setAttribute('href',`https://rickandmortyapi.com/api/character/${character.id}`)
        Name.onclick = stopProp;
        
        let addline1 = document.createElement('br')
        NameBox.appendChild(addline1)


        let status = document.createElement('span')
        NameBox.appendChild(status)
        if(character.status == "Alive"){
            status.classList.add('dotGreen');
        }else{
            status.classList.add('dotRed')
        }

        let statusSpecies = document.createElement('span')
        NameBox.appendChild(statusSpecies)
        statusSpecies.classList.add('live')
        statusSpecies.innerHTML = `${character.status} - ${character.species}`

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
        location.setAttribute('href',character.location.url)
        location.setAttribute('target','_blank')
        location.onclick = stopProp;
        location.classList.add('location_value')
        location.innerHTML = character.location.name;

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
        firstSeen.innerHTML = mappedEpisode.get(+(characterToEpisode[0])).name
        firstSeen.setAttribute('href',`https://rickandmortyapi.com/api/episode/${+(characterToEpisode[0])}`)

        return box


}

function stopProp(event){
    event.stopPropagation()
}

window.addEventListener('click',(event)=>{
    if(event.target.classList.contains('modal')){
        event.target.style.display = 'none'
    }
})

function addPaginationPage(page) {
	const pageLink = document.createElement('a');
	pageLink.href = '#' + getPageId(page);
	pageLink.innerHTML = page;
	
	const listItem = document.createElement('li');
	listItem.className = 'article-list__pagination__item';
	listItem.appendChild(pageLink);
	
	articleListPagination.appendChild(listItem);
	
	if (page === 2) {
		articleListPagination.classList.remove('article-list__pagination--inactive');
	}
}



function addPage(page) {
	getArticlePage(page);
	addPaginationPage(page);
}

function getDocumentHeight() {
	const body = document.body;
	const html = document.documentElement;
	return Math.max(
		body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight
	);
};

function getScrollTop() {
	return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

addPage(++page);

window.onscroll = function() {
    console.log(window.innerHeight,getScrollTop(),getDocumentHeight())
	if (getScrollTop() + 10 < getDocumentHeight() - window.innerHeight) return;
    addPage(++page);
};