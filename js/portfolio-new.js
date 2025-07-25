// Portfolio page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize portfolio functionality
    initializePortfolioFilter();
    initializePortfolioModal();
    initializeTestimonialsCarousel();
    initializeStatsCounter();
});

// Portfolio filter functionality
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Portfolio modal functionality
function initializePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePortfolioModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closePortfolioModal();
        }
    });
}

// Open portfolio modal with project details
function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolioModal');
    const modalContent = document.getElementById('portfolioModalContent');
    
    // Get project data
    const projectData = getProjectData(projectId);
    
    // Populate modal content
    modalContent.innerHTML = `
        <div class="portfolio-modal-header">
            <h2>${projectData.title}</h2>
            <p class="project-category">${projectData.category}</p>
        </div>
        
        <div class="portfolio-modal-gallery">
            <div class="main-image">
                <img src="${projectData.mainImage}" alt="${projectData.title}">
            </div>
            <div class="thumbnail-gallery">
                ${projectData.gallery.map(img => `
                    <img src="${img}" alt="Project gallery" onclick="changeMainImage('${img}')">
                `).join('')}
            </div>
        </div>
        
        <div class="portfolio-modal-details">
            <div class="project-description">
                <h3>Project Overview</h3>
                <p>${projectData.description}</p>
            </div>
            
            <div class="project-info">
                <h3>Project Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Client:</strong>
                        <span>${projectData.client}</span>
                    </div>
                    <div class="info-item">
                        <strong>Duration:</strong>
                        <span>${projectData.duration}</span>
                    </div>
                    <div class="info-item">
                        <strong>Team Size:</strong>
                        <span>${projectData.teamSize}</span>
                    </div>
                    <div class="info-item">
                        <strong>Budget:</strong>
                        <span>${projectData.budget}</span>
                    </div>
                </div>
            </div>
            
            <div class="project-results">
                <h3>Results & Impact</h3>
                <ul>
                    ${projectData.results.map(result => `<li>${result}</li>`).join('')}
                </ul>
            </div>
            
            <div class="project-testimonial">
                <blockquote>
                    "${projectData.testimonial.quote}"
                </blockquote>
                <cite>— ${projectData.testimonial.author}, ${projectData.testimonial.position}</cite>
            </div>
        </div>
        
        <div class="portfolio-modal-actions">
            <button class="btn btn-primary" onclick="requestSimilarService('${projectData.category}')">
                Request Similar Service
            </button>
            <button class="btn btn-outline" onclick="shareProject('${projectId}')">
                Share Project
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close portfolio modal
function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Change main image in modal gallery
function changeMainImage(imageSrc) {
    const mainImage = document.querySelector('.main-image img');
    mainImage.src = imageSrc;
}

// Get project data (with real project information)
function getProjectData(projectId) {
    const projects = {
        'catering-1': {
            title: 'Corporate Conference Catering',
            category: 'Corporate Catering',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczNtNz_zxpRWOZgY0jLsWkTVmJXFewD3zhW6tJezUnYE--k_v5p2Ab2rffWoNm5RXx1GMsXmfabCSlmurfFlBtqp415MW_3Ul4GrKKHeLSnvKDromhVGPKq3zlx937PgxvvPWF_jSPN0zdgQDhALAdLoVg=w1024-h683-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczNtNz_zxpRWOZgY0jLsWkTVmJXFewD3zhW6tJezUnYE--k_v5p2Ab2rffWoNm5RXx1GMsXmfabCSlmurfFlBtqp415MW_3Ul4GrKKHeLSnvKDromhVGPKq3zlx937PgxvvPWF_jSPN0zdgQDhALAdLoVg=w1024-h683-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczMwXJHJ2zmhH7W44IZxtDDKyHNKr64KvtdXKOqLPI4PsOgpl1bdzwDBkJwj6Nxsj665rxoaPvNRrfbunuweeXYyrx0NBqoo1xtqmDZCQzUL9v2jID92E38rBWgNUc6UXzD4LwoFGncARv9SKoiVeogSIA=w1024-h736-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczO7oVUX_OR7JVlXvSTv9RiROaNCqUqIx8qAHFR2a1pNVc0r5mFTNTfdoU-KQW1C1_CrA8Bfiur-nxrueXmOq95FOFm4dlMbtqN5IjOW4QD0_EoKcWznDmCHcNRmx6srfKj5lB5dd3ZCB6jFST3mVdXqxg=w1024-h580-s-no-gm?authuser=0'
            ],
            description: 'Professional catering services for corporate conferences and business events. Our experienced team delivers exceptional culinary experiences that enhance your professional gatherings and leave lasting impressions on your guests.',
            client: 'TechHub Nairobi',
            duration: '2 Days',
            teamSize: '15 Staff Members',
            budget: 'KES 800,000',
            results: [
                '500+ guests served across two days',
                '99% positive feedback on food quality',
                'Zero food safety incidents',
                'Successful accommodation of 50+ special dietary requirements',
                'Client secured repeat booking for next year'
            ],
            testimonial: {
                quote: 'The catering team exceeded our expectations. Professional, delicious, and perfectly coordinated.',
                author: 'Sarah Kimani',
                position: 'CEO, TechHub Nairobi'
            }
        },
        'catering-2': {
            title: 'Elegant Event Catering',
            category: 'Event Catering',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczMwXJHJ2zmhH7W44IZxtDDKyHNKr64KvtdXKOqLPI4PsOgpl1bdzwDBkJwj6Nxsj665rxoaPvNRrfbunuweeXYyrx0NBqoo1xtqmDZCQzUL9v2jID92E38rBWgNUc6UXzD4LwoFGncARv9SKoiVeogSIA=w1024-h736-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczMwXJHJ2zmhH7W44IZxtDDKyHNKr64KvtdXKOqLPI4PsOgpl1bdzwDBkJwj6Nxsj665rxoaPvNRrfbunuweeXYyrx0NBqoo1xtqmDZCQzUL9v2jID92E38rBWgNUc6UXzD4LwoFGncARv9SKoiVeogSIA=w1024-h736-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczN5MCuP7JiGKGQTyt6RBUfWOT84Ppgzp_0mtlbhJrezh7Us1xxB88yZOkDc0iefVdA6jimEzKKvS-uS3sMZDFuOkFewTq2B7V0IRtDtCkRPjgo1KvrqkBEHh-9k9bvK9ixWDsBzE8bkpHXQDlof8huydw=w1024-h706-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczNf-nq7gR42H-JC3k0ISvv8Iv3d9D7b4cndu3OqaswnKWzUxPS12f8TyYFEHQS9_Gh4M50yLEpV3TX4k-63ifN-5LXIfNA-Z5yiENvO-AHaaMrdM06F1j2hx4duIWWmNRdYqbi_9ywaKe-NFomcYM3Nhw=w1024-h658-s-no-gm?authuser=0'
            ],
            description: 'Sophisticated catering setup for special occasions and elegant events. We specialize in creating memorable dining experiences that complement the ambiance and significance of your celebration.',
            client: 'Elite Events Ltd',
            duration: '1 Day',
            teamSize: '12 Staff Members',
            budget: 'KES 600,000',
            results: [
                '200 guests served with premium cuisine',
                'Elegant presentation and setup',
                'Zero service interruptions',
                'Complete client satisfaction',
                'Featured in local event magazines'
            ],
            testimonial: {
                quote: 'The attention to detail and elegant presentation made our event truly special.',
                author: 'Grace Wanjiku',
                position: 'Event Coordinator, Elite Events Ltd'
            }
        },
        'catering-3': {
            title: 'Premium Buffet Service',
            category: 'Buffet Catering',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczO7oVUX_OR7JVlXvSTv9RiROaNCqUqIx8qAHFR2a1pNVc0r5mFTNTfdoU-KQW1C1_CrA8Bfiur-nxrueXmOq95FOFm4dlMbtqN5IjOW4QD0_EoKcWznDmCHcNRmx6srfKj5lB5dd3ZCB6jFST3mVdXqxg=w1024-h580-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczO7oVUX_OR7JVlXvSTv9RiROaNCqUqIx8qAHFR2a1pNVc0r5mFTNTfdoU-KQW1C1_CrA8Bfiur-nxrueXmOq95FOFm4dlMbtqN5IjOW4QD0_EoKcWznDmCHcNRmx6srfKj5lB5dd3ZCB6jFST3mVdXqxg=w1024-h580-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczPUT_b5eB8vYfglPGcc1JNljV9XGddo3PahOHeRawQ33IQeUv_AzSvR9KzbIvmWrcO6RNLbAFu_mA2MwCOwgZxVzaOxkMXQNEhMCrIcRNvna2EB-K9gx2F44sD1N4uG-4EtRIqFYOIpeyhI3bDV132kLA=w1024-h683-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczNT7a25_xgd22O1p57JeXTtSeMyiKwtXP6G3Y3YMzIF5Eag4CwDz17kEDgOJApBXYXVXKGgc4iphYrNVEv4JUZDD3rJtyms0H2V4N6t7pyOv-iBPN9UQOflAQy7QGL3vLmdFBAQUpNZn9Z7uCSM5N4jaA=w1024-h683-s-no-gm?authuser=0'
            ],
            description: 'Comprehensive buffet catering for large gatherings and corporate functions. Our buffet services combine variety, quality, and efficient service to accommodate large groups while maintaining exceptional standards.',
            client: 'Summit Corporation',
            duration: '1 Day',
            teamSize: '18 Staff Members',
            budget: 'KES 950,000',
            results: [
                '750+ guests served efficiently',
                'Multiple cuisine options available',
                'Smooth service flow management',
                'Zero wait time complaints',
                'Cost-effective solution for large groups'
            ],
            testimonial: {
                quote: 'Outstanding buffet service that handled our large group seamlessly.',
                author: 'Michael Ochieng',
                position: 'Operations Manager, Summit Corporation'
            }
        },
        'catering-4': {
            title: 'Outdoor Event Catering',
            category: 'Outdoor Catering',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczN5MCuP7JiGKGQTyt6RBUfWOT84Ppgzp_0mtlbhJrezh7Us1xxB88yZOkDc0iefVdA6jimEzKKvS-uS3sMZDFuOkFewTq2B7V0IRtDtCkRPjgo1KvrqkBEHh-9k9bvK9ixWDsBzE8bkpHXQDlof8huydw=w1024-h706-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczN5MCuP7JiGKGQTyt6RBUfWOT84Ppgzp_0mtlbhJrezh7Us1xxB88yZOkDc0iefVdA6jimEzKKvS-uS3sMZDFuOkFewTq2B7V0IRtDtCkRPjgo1KvrqkBEHh-9k9bvK9ixWDsBzE8bkpHXQDlof8huydw=w1024-h706-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczN9mer-vdHgO4w9FjvyBtRqOmOxjtUSZB00LXjNpBKbC4jB-PxL6_QMYr5frPdMa-bXDaojItlJZKVQKT_P0piVeltRPvgNuD-S8C6aca72MsuOZJMkVCiJD6HRJuhTGIG2xCq47vxWkEroSez8oIKJJQ=w1024-h553-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczNEKpTncvzoPkf_CWXXpdawPEs1VXq2alc9umY3eF9oYy9OOYyAEUh5g8Ckgn3nZjfalwjzx2ySsft0dKD_2riLePmvhUlGkVt77lfD_k-h6jH96Szz8k-i9qjWBX__9NGrPM48y6TSGzvPtxjHqzpXJg=w1024-h743-s-no-gm?authuser=0'
            ],
            description: 'Professional outdoor catering services for all occasions. We bring restaurant-quality food service to outdoor venues, handling all logistics and weather considerations for successful outdoor events.',
            client: 'Garden Club Events',
            duration: '1 Day',
            teamSize: '14 Staff Members',
            budget: 'KES 700,000',
            results: [
                '300+ guests served in outdoor setting',
                'Weather-resistant setup maintained',
                'Fresh food quality preserved',
                'Seamless outdoor service execution',
                'Beautiful presentation despite outdoor challenges'
            ],
            testimonial: {
                quote: 'They made outdoor catering look effortless while maintaining exceptional quality.',
                author: 'Jane Muthoni',
                position: 'Event Manager, Garden Club Events'
            }
        },
        'catering-5': {
            title: 'Wedding Catering Excellence',
            category: 'Wedding Catering',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczNf-nq7gR42H-JC3k0ISvv8Iv3d9D7b4cndu3OqaswnKWzUxPS12f8TyYFEHQS9_Gh4M50yLEpV3TX4k-63ifN-5LXIfNA-Z5yiENvO-AHaaMrdM06F1j2hx4duIWWmNRdYqbi_9ywaKe-NFomcYM3Nhw=w1024-h658-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczNf-nq7gR42H-JC3k0ISvv8Iv3d9D7b4cndu3OqaswnKWzUxPS12f8TyYFEHQS9_Gh4M50yLEpV3TX4k-63ifN-5LXIfNA-Z5yiENvO-AHaaMrdM06F1j2hx4duIWWmNRdYqbi_9ywaKe-NFomcYM3Nhw=w1024-h658-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczPhpx_I8w0BnwkULGre33o2DsdA_268CtJg264HsX8MK4wJ6eI76uVq2aCjqXmH-g6I-mc4_LE2P8_lbOTSl2-g3ub1ruMtmGR9ViyS6UCyaYAeFFSQceGKbk9d0_XWslCa5dRj3qLN_xor0wngQnZo8A=w1024-h555-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczP1PwLFeakEcQ4AuUVedQHn_OOiL9IW_efFWhHTfoqIqkgIMFn1DozUmBCriQijGgowd3W8z-BnTOQ-d1RdR8dFpuzF0Jg5r7ifhOKUAVIA2qTyhH-nm0pEDLN80w7yxU0A04C8woNV5wcplXEzshBfcg=w1024-h683-s-no-gm?authuser=0'
            ],
            description: 'Exquisite catering services for wedding celebrations. We create memorable culinary experiences that complement the joy and significance of your special day, with customized menus and elegant presentation.',
            client: 'The Johnson Wedding',
            duration: '1 Day',
            teamSize: '16 Staff Members',
            budget: 'KES 1,100,000',
            results: [
                '250 wedding guests delighted',
                'Custom menu perfectly executed',
                'Flawless timing with ceremony',
                'Beautiful presentation throughout',
                'Couple\'s vision brought to life'
            ],
            testimonial: {
                quote: 'Our wedding catering was absolutely perfect. Every guest complimented the food.',
                author: 'Sarah & James Johnson',
                position: 'Wedding Couple'
            }
        },
        'catering-6': {
            title: 'Professional Catering Team',
            category: 'Professional Service',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczPUT_b5eB8vYfglPGcc1JNljV9XGddo3PahOHeRawQ33IQeUv_AzSvR9KzbIvmWrcO6RNLbAFu_mA2MwCOwgZxVzaOxkMXQNEhMCrIcRNvna2EB-K9gx2F44sD1N4uG-4EtRIqFYOIpeyhI3bDV132kLA=w1024-h683-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczPUT_b5eB8vYfglPGcc1JNljV9XGddo3PahOHeRawQ33IQeUv_AzSvR9KzbIvmWrcO6RNLbAFu_mA2MwCOwgZxVzaOxkMXQNEhMCrIcRNvna2EB-K9gx2F44sD1N4uG-4EtRIqFYOIpeyhI3bDV132kLA=w1024-h683-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczOz7glYAA1ldsVEbOW7Pitk0ALphJ0MfhAV8uWlxGMBULG8CUzfo16MydwqUhQAgm26WgOxUvpFkp4FH7cSMlgLPZxh7RJ6pPkx710en7cevkPlKiYVPJiYQtQsPxKQ0WoMfj4eDZPHOAgnWLNYoECAng=w1024-h689-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczOAID_AvDyVDL86yqgc3Z4H0t2FpOWdi2CTxTCmQb196XHc_lijGYbRSaJtuxdYXG0_sioy6iNknSBA7yx6tHdjpKOO4zIgne5VMUJ_6qOp_FH5abp4t1GyYXzHchPakZ0geH0hQVyEc8W6cIBtW5RR8A=w1024-h696-s-no-gm?authuser=0'
            ],
            description: 'Our experienced culinary professionals delivering excellence in every event. Meet the team behind our success - dedicated professionals committed to making your events memorable through exceptional service.',
            client: 'Various Corporate Clients',
            duration: 'Ongoing',
            teamSize: '20+ Professional Staff',
            budget: 'Variable',
            results: [
                '500+ successful events delivered',
                '100% professional presentation',
                'Consistent quality across all events',
                'Expert culinary skills demonstrated',
                'Outstanding client relationships built'
            ],
            testimonial: {
                quote: 'The professionalism and expertise of the Mindscope team is unmatched in the industry.',
                author: 'David Kiprotich',
                position: 'Corporate Events Manager'
            }
        },
        'event-1': {
            title: 'Corporate Event Management',
            category: 'Corporate Events',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczMDgh2ckFxPA7bQApgrCHEnEYNHM-3Kd_kErqzhGukp7WY5fIzQ6raAD7VClgJJ3ue0CH9l9nsPYhgjZMyk3yjB_wk2E7wxns0KIzia-KArnawsUxVIAHYcXDODizWdslUN3o-FaxUWeCfRiLT815ygYA=w640-h480-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczMDgh2ckFxPA7bQApgrCHEnEYNHM-3Kd_kErqzhGukp7WY5fIzQ6raAD7VClgJJ3ue0CH9l9nsPYhgjZMyk3yjB_wk2E7wxns0KIzia-KArnawsUxVIAHYcXDODizWdslUN3o-FaxUWeCfRiLT815ygYA=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczMx2HTBv9mHHnfnBhbxBXFXmA1IGmJfXIRNbySy3qpGOECBbydDaUpHukl4Osn3mzGRRHXCtK2Gs_vFxqhfGepBe-4yXMLfkwd0phja1uTX0sYc3aUICVR9Zhhu_M1RREaoN6_BsrAgsxhpaUMuAbZgog=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczP6uuFlubId3q1_x9WyaH0Gdrjd9PV-8yklu1ULmcU2Ou6lbXeycWuZ3vFz4zOYHfRE_yKqNs49uCTPSWWbMuBu-eLWZSrmjrQAn0mhhVt9yHc871JrdgOyPGrOcmi3FlRGHPjJyDzQSWD8ECh8TIJ1zg=w640-h480-s-no-gm?authuser=0'
            ],
            description: 'Professional management of corporate events and conferences. Our experienced team handles every aspect of corporate event planning and execution, ensuring seamless professional experiences that meet business objectives.',
            client: 'Corporate Partners Ltd',
            duration: '3 Days',
            teamSize: '12 Event Coordinators',
            budget: 'KES 1,500,000',
            results: [
                '400+ business professionals attended',
                'Flawless execution across 3 days',
                'Zero technical difficulties',
                'Successful networking facilitation',
                'Client satisfaction rating of 98%'
            ],
            testimonial: {
                quote: 'Outstanding event management that elevated our corporate gathering to new heights.',
                author: 'Peter Mwangi',
                position: 'Events Director, Corporate Partners Ltd'
            }
        },
        'event-2': {
            title: 'Elegant Wedding Planning',
            category: 'Wedding Events',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczMx2HTBv9mHHnfnBhbxBXFXmA1IGmJfXIRNbySy3qpGOECBbydDaUpHukl4Osn3mzGRRHXCtK2Gs_vFxqhfGepBe-4yXMLfkwd0phja1uTX0sYc3aUICVR9Zhhu_M1RREaoN6_BsrAgsxhpaUMuAbZgog=w640-h480-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczMx2HTBv9mHHnfnBhbxBXFXmA1IGmJfXIRNbySy3qpGOECBbydDaUpHukl4Osn3mzGRRHXCtK2Gs_vFxqhfGepBe-4yXMLfkwd0phja1uTX0sYc3aUICVR9Zhhu_M1RREaoN6_BsrAgsxhpaUMuAbZgog=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczP6uuFlubId3q1_x9WyaH0Gdrjd9PV-8yklu1ULmcU2Ou6lbXeycWuZ3vFz4zOYHfRE_yKqNs49uCTPSWWbMuBu-eLWZSrmjrQAn0mhhVt9yHc871JrdgOyPGrOcmi3FlRGHPjJyDzQSWD8ECh8TIJ1zg=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczOR252o2WJflY7zXS_6frJKcn2D53EXxJ5FUrZu6U_Vt1-I7jG-j7LmGeNEtMaYCn5dof-01xYSWXQodZ3oNfeAa-Aa94NNGqAtHciA9Mp2jUbd6Syo7S9XEVuHSYodDIfHV4tT2opEY-cPRSI5xiwbHg=w640-h480-s-no-gm?authuser=0'
            ],
            description: 'Complete wedding event planning and coordination services. We create magical wedding experiences that bring couples\' dreams to life through meticulous planning, creative design, and flawless execution.',
            client: 'The Mwangi Wedding',
            duration: '6 Months Planning + Event Day',
            teamSize: '10 Wedding Specialists',
            budget: 'KES 2,200,000',
            results: [
                '180 wedding guests celebrated',
                'Perfect timeline execution',
                'Dream venue transformation',
                'Seamless vendor coordination',
                'Unforgettable memories created'
            ],
            testimonial: {
                quote: 'They turned our wedding dreams into reality. Every detail was perfect.',
                author: 'Grace & David Mwangi',
                position: 'Wedding Couple'
            }
        },
        'event-3': {
            title: 'Social Event Coordination',
            category: 'Social Events',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczP6uuFlubId3q1_x9WyaH0Gdrjd9PV-8yklu1ULmcU2Ou6lbXeycWuZ3vFz4zOYHfRE_yKqNs49uCTPSWWbMuBu-eLWZSrmjrQAn0mhhVt9yHc871JrdgOyPGrOcmi3FlRGHPjJyDzQSWD8ECh8TIJ1zg=w640-h480-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczP6uuFlubId3q1_x9WyaH0Gdrjd9PV-8yklu1ULmcU2Ou6lbXeycWuZ3vFz4zOYHfRE_yKqNs49uCTPSWWbMuBu-eLWZSrmjrQAn0mhhVt9yHc871JrdgOyPGrOcmi3FlRGHPjJyDzQSWD8ECh8TIJ1zg=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczO0xUfxq8PTX4Pm5M0COad5bP6EbiL36veBvafHDOl3iEAsRwp_0okuhvz9SpoD9lt-E2rosm4Yd8Ciq8m1-yZws60SYmVavNinDUqL4RUTHnIQACvri7pvettt2PwCs8z0pMvdcR5WUvDf9c6uJEFIcQ=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczM7YmslY6dLMmqutUro-BHoV--uCWQp85tRWrLeukRHSMeJSqOuW0jNx41Z-RKpGyWNtyHq8Vj7qpPagvoPelFopHEHAGFFzwm-S7OOd2LQrZZNatEIEC0TagsA1QBrMF-OVf_9WzSqrTdKRpC_ystSWA=w640-h480-s-no-gm?authuser=0'
            ],
            description: 'Expert coordination for social gatherings and celebrations. We specialize in creating memorable social events that bring people together, from birthday parties to anniversary celebrations and family reunions.',
            client: 'Kimani Family Reunion',
            duration: '2 Months Planning + Event Day',
            teamSize: '8 Event Coordinators',
            budget: 'KES 800,000',
            results: [
                '120 family members reunited',
                'Successful multi-generational event',
                'Traditional and modern elements blended',
                'Emotional and meaningful celebration',
                'Strengthened family connections'
            ],
            testimonial: {
                quote: 'A beautiful family gathering that brought three generations together perfectly.',
                author: 'Mary Kimani',
                position: 'Family Reunion Organizer'
            }
        },
        'event-4': {
            title: 'Conference Management',
            category: 'Conference Events',
            mainImage: 'https://lh3.googleusercontent.com/pw/AP1GczOR252o2WJflY7zXS_6frJKcn2D53EXxJ5FUrZu6U_Vt1-I7jG-j7LmGeNEtMaYCn5dof-01xYSWXQodZ3oNfeAa-Aa94NNGqAtHciA9Mp2jUbd6Syo7S9XEVuHSYodDIfHV4tT2opEY-cPRSI5xiwbHg=w640-h480-s-no-gm?authuser=0',
            gallery: [
                'https://lh3.googleusercontent.com/pw/AP1GczOR252o2WJflY7zXS_6frJKcn2D53EXxJ5FUrZu6U_Vt1-I7jG-j7LmGeNEtMaYCn5dof-01xYSWXQodZ3oNfeAa-Aa94NNGqAtHciA9Mp2jUbd6Syo7S9XEVuHSYodDIfHV4tT2opEY-cPRSI5xiwbHg=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczPkjDAZkf9Y9a2u1QD-FzJ2Ft0wVSKXj8N6zFPZjW4cIyE7csCTvFds_Su06V3s7-TO1qyYB0cQ9ln5vS7vk6OGgn3oRPTg-cyeoXhyYtdy9sPM4-MIu8dO4T_lzemW9cEr1wHVdH8gIChrn00RO-z_yQ=w640-h480-s-no-gm?authuser=0',
                'https://lh3.googleusercontent.com/pw/AP1GczPggwZl7kwWfnMOK7yPlGppA8XVK212R1oaPc_jlYV9Z8Nw12eYF9zg3Wfeh1lqCmaStLc6ueP9jCFh118pbjqV1bjeCwFBQKoH7Uy02Na7WhmnTIn8HKDuP5n7CO7g4Woo2bY4sx9Z6v7gBClVTWgjUA=w640-h480-s-no-gm?authuser=0'
            ],
            description: 'Professional conference and summit management services. We handle all aspects of conference planning and execution, from speaker coordination to technical setup, ensuring successful knowledge-sharing events.',
            client: 'Kenya Business Summit',
            duration: '4 Months Planning + 2-Day Event',
            teamSize: '15 Conference Specialists',
            budget: 'KES 3,000,000',
            results: [
                '600+ business leaders attended',
                '20+ keynote speakers coordinated',
                'Flawless technical execution',
                'Successful networking facilitation',
                'Media coverage across multiple platforms'
            ],
            testimonial: {
                quote: 'A world-class conference that exceeded all our expectations and industry standards.',
                author: 'Dr. James Kinyua',
                position: 'Conference Chairman, Kenya Business Summit'
            }
        },
        'consulting-1': {
            title: 'SME Growth Strategy',
            category: 'Business Consulting',
            mainImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
            ],
            description: 'Strategic business consulting for a local SME looking to expand operations. Comprehensive analysis, strategic planning, and implementation support for sustainable growth.',
            client: 'GreenTech Solutions',
            duration: '4 Months',
            teamSize: '3 Consultants',
            budget: 'KES 400,000',
            results: [
                '40% increase in operational efficiency',
                'Successful market expansion into 2 new regions',
                '25% revenue growth within 6 months',
                'Streamlined business processes',
                'Improved team productivity and satisfaction'
            ],
            testimonial: {
                quote: 'The strategic insights provided transformed our business approach completely.',
                author: 'Peter Mwangi',
                position: 'CEO, GreenTech Solutions'
            }
        },
        'consulting-2': {
            title: 'Digital Transformation Strategy',
            category: 'Digital Consulting',
            mainImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=300&fit=crop'
            ],
            description: 'Complete digital overhaul for manufacturing company seeking to modernize operations. Implementation of digital systems, process automation, and technology integration.',
            client: 'Precision Manufacturing Ltd',
            duration: '8 Months',
            teamSize: '6 Digital Specialists',
            budget: 'KES 1,800,000',
            results: [
                '60% reduction in manual processes',
                'Real-time production monitoring implemented',
                '35% improvement in production efficiency',
                'Modern inventory management system',
                'Enhanced data analytics capabilities'
            ],
            testimonial: {
                quote: 'The digital transformation has revolutionized our manufacturing processes.',
                author: 'Margaret Wanjiru',
                position: 'Operations Director, Precision Manufacturing'
            }
        },
        'logistics-1': {
            title: 'Corporate Fleet Management',
            category: 'Transport & Logistics',
            mainImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop'
            ],
            description: 'Comprehensive transport solution for multinational company including fleet management, route optimization, and driver coordination across multiple locations.',
            client: 'Global Enterprises Kenya',
            duration: 'Ongoing Service',
            teamSize: '25 Logistics Specialists',
            budget: 'KES 5,000,000/year',
            results: [
                '40% reduction in transport costs',
                '99.5% on-time delivery rate',
                'Fleet optimization across 5 cities',
                '30% improvement in fuel efficiency',
                'Zero major safety incidents'
            ],
            testimonial: {
                quote: 'Exceptional logistics management that transformed our distribution network.',
                author: 'John Kariuki',
                position: 'Logistics Manager, Global Enterprises'
            }
        },
        'wellness-1': {
            title: 'Executive Wellness Program',
            category: 'Wellness & Healing',
            mainImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
            gallery: [
                'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'
            ],
            description: 'Comprehensive wellness initiative for corporate leadership team including stress management, mental health support, and work-life balance coaching.',
            client: 'Executive Leadership Team',
            duration: '6 Months Program',
            teamSize: '4 Wellness Specialists',
            budget: 'KES 900,000',
            results: [
                '85% reduction in executive stress levels',
                'Improved leadership effectiveness scores',
                'Better work-life balance achieved',
                'Enhanced team communication',
                'Decreased burnout and turnover'
            ],
            testimonial: {
                quote: 'The wellness program transformed our leadership approach and personal well-being.',
                author: 'Dr. Susan Kihiko',
                position: 'CEO, Healthcare Innovation Ltd'
            }
        }
    };

    return projects[projectId] || {
        title: 'Project Not Found',
        category: 'Unknown',
        mainImage: 'https://via.placeholder.com/600x400',
        gallery: [],
        description: 'Project details not available.',
        client: 'N/A',
        duration: 'N/A',
        teamSize: 'N/A',
        budget: 'N/A',
        results: [],
        testimonial: { quote: '', author: '', position: '' }
    };
}

// Handle request for similar service
function requestSimilarService(category) {
    // Map categories to service URLs
    const serviceUrls = {
        'Corporate Catering': 'services/catering.html',
        'Event Catering': 'services/catering.html',
        'Buffet Catering': 'services/catering.html',
        'Outdoor Catering': 'services/catering.html',
        'Wedding Catering': 'services/catering.html',
        'Professional Service': 'services/catering.html',
        'Corporate Events': 'services/events.html',
        'Wedding Events': 'services/events.html',
        'Social Events': 'services/events.html',
        'Conference Events': 'services/events.html',
        'Business Consulting': 'services/consulting.html',
        'Digital Consulting': 'services/consulting.html',
        'Transport & Logistics': 'services/logistics.html',
        'Wellness & Healing': 'services/wellness.html'
    };

    const serviceUrl = serviceUrls[category] || 'contact.html';
    window.location.href = serviceUrl;
}

// Handle project sharing
function shareProject(projectId) {
    const projectData = getProjectData(projectId);
    const shareUrl = `${window.location.origin}${window.location.pathname}?project=${projectId}`;
    const shareText = `Check out this amazing project: ${projectData.title} by Mindscope Services Ltd`;

    if (navigator.share) {
        navigator.share({
            title: projectData.title,
            text: shareText,
            url: shareUrl
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Project link copied to clipboard!');
        });
    }
}

// Initialize testimonials carousel
function initializeTestimonialsCarousel() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Event listeners
    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance every 5 seconds
    setInterval(nextSlide, 5000);
}

// Initialize stats counter animation
function initializeStatsCounter() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = +counter.innerText;

        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => initializeStatsCounter(), 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Check for project parameter in URL and open modal
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId && getProjectData(projectId).title !== 'Project Not Found') {
        setTimeout(() => openPortfolioModal(projectId), 500);
    }
});
