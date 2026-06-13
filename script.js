document.addEventListener('DOMContentLoaded', function() {
    var navbar = document.querySelector('.navbar');
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) { navbar.classList.add('scrolled'); }
        else { navbar.classList.remove('scrolled'); }
    });

    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() { navLinks.classList.remove('active'); });
    });

    loadSettings();
    loadProjects();

    var form = document.querySelector('.contact-form');
    if (form) {
        if (window.location.search.indexOf('success=true') !== -1) {
            var btn = form.querySelector('.btn');
            if (btn) { btn.textContent = '已收到，谢谢！'; btn.style.background = '#6B7F5E'; }
            form.reset();
            if (window.history && window.history.replaceState) {
                window.history.replaceState({}, '', 'index.html#contact');
            }
        }
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var btn = form.querySelector('.btn');
            btn.textContent = '发送中...';
            btn.disabled = true;
            var data = new FormData(form);
            fetch('index.html', { method: 'POST', body: data })
                .then(function() {
                    btn.textContent = '已收到，谢谢！';
                    btn.style.background = '#6B7F5E';
                    form.reset();
                    setTimeout(function() {
                        btn.textContent = '发送咨询';
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                })
                .catch(function() {
                    btn.textContent = '发送失败，请重试';
                    btn.disabled = false;
                    setTimeout(function() { btn.textContent = '发送咨询'; }, 3000);
                });
        });
    }
});

var defaultProjects = [
    {id:1,title:"湖畔雅居",cat:"residential",cn:"住宅空间",area:"180㎡",sty:"现代简约",c1:"#C4A882",c2:"#8B7355",img:""},
    {id:2,title:"绿谷咖啡",cat:"commercial",cn:"商业空间",area:"120㎡",sty:"自然风格",c1:"#6B7F5E",c2:"#4A5E40",img:""},
    {id:3,title:"暖阳之家",cat:"residential",cn:"住宅空间",area:"260㎡",sty:"日式侘寂",c1:"#D4A574",c2:"#A67C52",img:""},
    {id:4,title:"创想工作室",cat:"office",cn:"办公空间",area:"350㎡",sty:"工业现代",c1:"#8B8B8B",c2:"#5A5A5A",img:""},
    {id:5,title:"云栖别墅",cat:"residential",cn:"住宅空间",area:"420㎡",sty:"新中式",c1:"#E8D5C4",c2:"#C9B8A8",img:""},
    {id:6,title:"拾光书店",cat:"commercial",cn:"商业空间",area:"200㎡",sty:"复古文艺",c1:"#B8860B",c2:"#8B6914",img:""}
];

function loadSettings() {
    var data = localStorage.getItem('pf_st');
    if (!data) return;
    var s = JSON.parse(data);
    if (s.name) {
        var brand = document.querySelector('.nav-brand');
        if (brand) brand.textContent = s.name;
        var footer = document.querySelector('.footer p');
        if (footer) footer.innerHTML = '\u00a9 2026 ' + s.name + ' <a href="admin.html" style="color:var(--primary-light);text-decoration:none;font-size:0.8rem;">管理后台</a>';
    }
    if (s.heroTitle) { var h1 = document.querySelector('.hero-content h1'); if (h1) h1.innerHTML = s.heroTitle.replace(/\n/g, '<br>'); }
    if (s.heroSub) { var p = document.querySelector('.hero-content p'); if (p) p.textContent = s.heroSub; }
    if (s.about) { var aboutPs = document.querySelectorAll('.about-text p'); if (aboutPs.length >= 2) aboutPs[1].textContent = s.about; }
    if (s.phone || s.email || s.address || s.wechat) {
        var items = document.querySelectorAll('.contact-item p');
        if (s.address && items[0]) items[0].textContent = s.address;
        if (s.phone && items[1]) items[1].textContent = s.phone;
        if (s.email && items[2]) items[2].textContent = s.email;
        if (s.wechat && items[3]) items[3].textContent = s.wechat;
    }
    if (s.stat1 || s.stat2 || s.stat3) {
        var nums = document.querySelectorAll('.stat-number');
        if (s.stat1 && nums[0]) nums[0].textContent = s.stat1;
        if (s.stat2 && nums[1]) nums[1].textContent = s.stat2;
        if (s.stat3 && nums[2]) nums[2].textContent = s.stat3;
    }
}

function loadProjects() {
    var data = localStorage.getItem('pf_pj');
    var projects;
    if (data) { try { projects = JSON.parse(data); } catch(e) { projects = defaultProjects; } }
    else { projects = defaultProjects; }
    renderProjects(projects);
}

function renderProjects(projects) {
    var grid = document.getElementById('projectGrid');
    grid.innerHTML = '';
    projects.forEach(function(p) {
        var bgStyle = p.img
            ? 'background-image:url(' + p.img + ');background-size:cover;background-position:center;'
            : 'background: linear-gradient(135deg, ' + p.c1 + ' 0%, ' + p.c2 + ' 100%);';
        var card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', p.cat);
        card.innerHTML =
            '<div class="project-image" style="' + bgStyle + '">' +
                '<div class="project-overlay">' +
                    '<span class="project-tag">' + p.cn + '</span>' +
                    '<h3>' + p.title + '</h3>' +
                    '<p>' + p.area + ' · ' + p.sty + '</p>' +
                '</div>' +
            '</div>';
        grid.appendChild(card);
    });
    setupFilters();
    setupAnimations();
}

function setupFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.onclick = function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            var cards = document.querySelectorAll('.project-card');
            cards.forEach(function(card) {
                var cat = card.getAttribute('data-category');
                if (filter === 'all' || cat === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        };
    });
}

function setupAnimations() {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.project-card, .about-container, .contact-container, .section-header').forEach(function(el) {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}
