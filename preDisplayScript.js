        //fetching Header and rendering to page
        fetch('Header.html').then(res => res.text()).then(data =>{
            document.querySelector('.headcontainer').innerHTML = data;
        });
        // fetching footer
        fetch('footer.html')
        .then(res => res.text())
        .then(data => {
        document.querySelector('footer').innerHTML = data;
        });