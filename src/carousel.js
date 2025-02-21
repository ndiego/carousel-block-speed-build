import '@wordpress/element';

import Splide from '@splidejs/splide';

console.log('Carousel script loaded');

document.addEventListener('DOMContentLoaded', function() {
	console.log('DOM Content Loaded');
	const containers = document.querySelectorAll('.carousel-container');
	console.log('Found carousel containers:', containers.length);
	
	document.querySelectorAll('.carousel-container').forEach(container => {
		// Debug the slides
		const slides = container.querySelectorAll('.wp-block-cover');
		console.log('Found slides:', slides.length);
		console.log('Slides HTML:', container.querySelector('.splide__list').innerHTML);

		const slidesToShow = parseInt(container.dataset.slidesToShow) || 1;
		const gap = parseInt(container.dataset.gap) || 0;
		const arrowColor = container.dataset.arrowColor || '#000000';
		const loop = container.dataset.loop === 'true';
		
		container.style.setProperty('--arrow-color', arrowColor);

		// Add splide__slide class to each cover block
		slides.forEach(slide => {
			const slideWrapper = document.createElement('li');
			slideWrapper.className = 'splide__slide';
			slide.parentNode.insertBefore(slideWrapper, slide);
			slideWrapper.appendChild(slide);
		});

		// Create floating arrows
		const floatingArrow = document.createElement('div');
		floatingArrow.className = 'floating-arrow';
		floatingArrow.innerHTML = `
			<div class="arrow-circle">
				<svg class="arrow-left" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
				</svg>
				<svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
				</svg>
			</div>
		`;
		container.appendChild(floatingArrow);

			// Initialize Splide
			const splide = new Splide(container, {
				type: loop ? 'loop' : 'slide',
				perPage: slidesToShow,
				gap: gap,
				arrows: false,
				pagination: false,
				rewind: false,
				breakpoints: {
					768: {
						perPage: 1,
					},
				},
				updateOnMove: true,
				speed: 400,
				easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
			}).mount();

			let mouseTimeout;
			let isRightSide = false;

			// Handle mouse movement
			container.addEventListener('mousemove', (e) => {
				const rect = container.getBoundingClientRect();
				const x = e.clientX - rect.left;
				const y = e.clientY - rect.top;
				isRightSide = x > rect.width / 2;

				floatingArrow.style.opacity = '1';
				floatingArrow.style.left = `${x}px`;
				floatingArrow.style.top = `${y}px`;
				floatingArrow.classList.toggle('right-side', isRightSide);
				floatingArrow.classList.toggle('left-side', !isRightSide);

				clearTimeout(mouseTimeout);
				mouseTimeout = setTimeout(() => {
					floatingArrow.style.opacity = '0';
				}, 2000);
			});

			// Handle click
			container.addEventListener('click', () => {
				if (isRightSide) {
					splide.go('+1');
				} else {
					splide.go('-1');
				}
			});

			container.addEventListener('mouseleave', () => {
				floatingArrow.style.opacity = '0';
			});
	});
}); 