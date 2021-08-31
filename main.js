
let btnexpoler = document.querySelector('.btn'),
    hadithsection = document.querySelector('.hadith');
    btnexpoler.addEventListener("click", ()=>{
        hadithsection.scrollIntoView({
            behavior:"smooth"
        })
    })

    
   

let fixedheader = document.querySelector('.header'),
    scrollbtn = document.querySelector('.scrollbtn');

window.addEventListener("scroll",()=>{
    window.scrollY > 100 ? fixedheader.classList.add('active') : fixedheader.classList.remove('active');
    if (window.scrollY > 500) {
        scrollbtn.classList.add('active')
    } else {
        scrollbtn.classList.remove('active')
    }
})

    let mainsection = document.querySelector('.main');
        scrollbtn.addEventListener("click",()=>{
                mainsection.scrollIntoView({
                    behavior:"smooth"
                })
        })
// Get Hadith data from api

let datalength = 0;

let Hadith = document.querySelector('.hadith_content'),
    next = document.querySelector('.next'),
    prev = document.querySelector('.prev'),
    num = document.querySelector('.number');

    function getdata () {
        fetch("https://api.hadith.sutanlab.id/books/muslim?range=1-300")
        .then(res=>res.json()).then(data=>{
            let datahadith = data.data.hadiths;
           gethadith();
            next.addEventListener("click" ,()=>{
                datalength == 299 ? datalength = 0 : datalength++;
                gethadith();
            })
            prev.addEventListener("click" ,()=>{
                datalength == 0 ? datalength = 299 : datalength--;
                gethadith();
            })
         
            function gethadith(){
                Hadith.innerText = datahadith[datalength].arab;

                num.innerText = `300/ ${datalength + 1}`;

            }
         
          
        })
    
    }

    getdata();

    // End Hadith section

    let sections = document.querySelectorAll('section'),
        links = document.querySelectorAll('.header li');

        links.forEach(link=>{
            link.addEventListener('click' ,()=>{
               document.querySelector('.active').classList.remove('active');
                    link.classList.add('active');
                   let target =  link.dataset.filter;
                   sections.forEach(section=>{
                       if(section.classList.contains(target)){
                           section.scrollIntoView(
                              {
                                  behavior: "smooth"
                              }
                           )
                       }
                   })
            })
        })


        // Fech Quran section data 
        let Quran = document.querySelector(".quran_content");
        
        getquran();

        function getquran(){
            fetch("http://api.alquran.cloud/v1/meta").then(response=>response.json())
             .then(data=>{
                 let surahas = data.data.surahs.references;
                 let numberOfsuahs = 114;
                    Quran.innerHTML = "";
                 for (let i = 0; i < numberOfsuahs; i++) {
                    Quran.innerHTML += `

                    <div class="surah">
                    <h4>
                    ${surahas[i].name}
                    </h4>
                    <p>
                    ${surahas[i].englishName}
                    </p>
                </div>

                    
                    `
                     
                 }
                 let surahstitle = document.querySelectorAll('.surah');
                 let popup = document.querySelector('.ayat_popup');
                 let ayat = document.querySelector('.ayat_content');

                 surahstitle.forEach((title,index)=>{
                    title.addEventListener('click',()=>{
                        fetch(`http://api.alquran.cloud/v1/surah/${index + 1}`).then(res=>res.json())
                        .then(data=>{
                            ayat.innerHTML = "";
                         let ayahs = data.data.ayahs;
                         ayahs.forEach(aya=>{
                             popup.classList.add('active');
                             ayat.innerHTML += `
                             <p>
                             ${ aya.numberInSurah } - ${aya.text}
                             
                             </p>
                             
                             `
                         })
                        
                        })
                       
                    

                    })

                 })
                 let closepopup = document.querySelector('.close');
                closepopup.addEventListener('click',()=>{
                    popup.classList.remove('active');
                })
             })
        }

       


       

            
         


        // Fech Pray time api 

        let cards = document.querySelector('.cards');

        getpraytime();

        function getpraytime (){

            fetch ('http://api.aladhan.com/v1/timingsByCity?city=sohag&country=egypt&method=8')

                .then(response=>response.json()).then(data=>{
                   let times = data.data.timings;

                   cards.innerHTML = "";

                 for (let time in times)

                   cards.innerHTML += `
                   
                   <div class="card">
                   <div class="circle">
                       <svg>
                           <circle cx="100" cy="100" r="100"></circle>
                          
                       </svg>
                       <div class="time">${times[time]}</div>
                   </div>
                   <p>${time}</p>
               </div>
                   
                   `
                })

        }

   

        // Sidebar Event

        let bars = document.querySelector('.bars'),
            sidbar = document.querySelector('.list');

            bars.addEventListener('click',()=>{
                sidbar.classList.toggle('active');
            });



            // 

             // Quran player fech data

        let surahcontent = document.querySelector('.namesurah');
        let audio = document.querySelector('.quranplayer');
        let ayatext = document.querySelector('.ayatext');
        let buttons = document.querySelector('.nxt'),
            on = document.querySelector('.on'),
            back = document.querySelector('.back');

            
            function getaudio () {
                fetch('https://api.quran.sutanlab.id/surah').then(resp=>resp.json())
                    .then(data=>{
                        for (let surahname in data.data)

                            surahcontent.innerHTML+= `
                            
                            <div>
                            <p>${data.data[surahname].name.long}</p>
                            <p>${data.data[surahname].name.transliteration.en}</p>
                            
                            </div>
                            
                            `

                            let allsurah = document.querySelectorAll('.namesurah div'),
                            ayastext ,
                            ayaaudio ;
                            allsurah.forEach((items,index)=>{
                               items.addEventListener('click',()=>{
                                   fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
                                    .then(respo=>respo.json()).then(data=>{
                                        ayastext = [],
                                        ayaaudio = [];
                                        let verses = data.data.verses;
                                        verses.forEach(verse=>{
                                          ayastext.push(verse.text.arab);
                                          ayaaudio.push(verse.audio.primary);


                                        })
                                        let indexaudio = 0;

                                        changeaya (indexaudio)
                                        audio.addEventListener('ended',()=>{
                                            indexaudio++;
                                            if(indexaudio < ayaaudio.length){
                                                changeaya(indexaudio);
                                            } 
                                            else {
                                                indexaudio= 0;
                                               changeaya(indexaudio)
                                                audio.pause()
                                                Swal.fire({
                                                    position: 'center',
                                                    icon: 'success',
                                                    title: 'صدق الله العظيم',
                                                    showConfirmButton: false,
                                                    timer: 1500
                                                  })
                                            }
                                        })
                                        buttons.addEventListener('click',()=>{

                                            indexaudio < ayaaudio.length-1 ? indexaudio++  : indexaudio = 0;
                                           changeaya(indexaudio);
                                        })
                                        back.addEventListener('click',()=>{
                                           
                                            indexaudio == 0 ? ayaaudio =indexaudio.length-1 : indexaudio--;
                                            changeaya(indexaudio)
                                        })
                                        
                                        function changeaya(index){
                                            audio.src= ayaaudio[index];
                                      
                                            ayatext.innerHTML = ayastext[index]
                                        
                                        }
                                    })
                               })

                            })
                    })


            }

            getaudio();


