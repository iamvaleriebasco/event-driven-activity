  // Get elements
        const video = document.getElementById('videoPlayer');
        const statusText = document.getElementById('statusText');
        const volumeText = document.getElementById('volumeText');
        const eventLog = document.getElementById('eventLog');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggle = document.getElementById('sidebarToggle');
        const parallaxBg = document.querySelector('.parallax-bg');

        // Event logging function
        function logEvent(message) {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            
            const now = new Date();
            const timestamp = now.toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
            
            eventItem.innerHTML = `
                <div class="event-time">[${timestamp}]</div>
                <div class="event-message">${message}</div>
            `;
            
            eventLog.insertBefore(eventItem, eventLog.firstChild);
            
            // Limit log entries
            while (eventLog.children.length > 50) {
                eventLog.removeChild(eventLog.lastChild);
            }
        }

        // Video event listeners
        video.addEventListener('play', () => {
            statusText.textContent = 'Playing';
            statusText.className = 'status-value playing';
            logEvent('▶ PLAY event fired');
        });

        video.addEventListener('pause', () => {
            statusText.textContent = 'Paused';
            statusText.className = 'status-value paused';
            logEvent('⏸ PAUSE event fired');
        });

        video.addEventListener('ended', () => {
            statusText.textContent = 'Ended';
            statusText.className = 'status-value ended';
            logEvent('⏹ ENDED event fired');
        });

        video.addEventListener('volumechange', () => {
            const volumePercent = Math.round(video.volume * 100);
            volumeText.textContent = `${volumePercent}%`;
            logEvent(`🔊 VOLUME CHANGE event fired: ${volumePercent}%`);
        });

        video.addEventListener('seeked', () => {
            const currentTime = video.currentTime.toFixed(2);
            logEvent(`⏩ SEEKED event fired: ${currentTime}s`);
        });

        video.addEventListener('timeupdate', () => {
            // Throttle time update logs (every 5 seconds)
            if (Math.floor(video.currentTime) % 5 === 0 && Math.floor(video.currentTime) !== window.lastLoggedTime) {
                window.lastLoggedTime = Math.floor(video.currentTime);
                // Uncomment to see time updates: logEvent(`⏱ Time update: ${Math.floor(video.currentTime)}s`);
            }
        });

        // Sidebar toggle
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('closed');
            sidebarToggle.textContent = sidebar.classList.contains('closed') ? '▶' : '◀';
            logEvent(sidebar.classList.contains('closed') ? '➡ Sidebar closed' : '⬅ Sidebar opened');
        });

        // Parallax effect
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const heroHeight = document.querySelector('.hero-section').offsetHeight;
                    
                    if (scrolled <= heroHeight) {
                        parallaxBg.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0003})`;
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });

       

        // Set first suggested video as active
        document.querySelector('.suggested-video').classList.add('active');

        // Suggested video click handlers
        document.querySelectorAll('.suggested-video').forEach(videoCard => {
            videoCard.addEventListener('click', function() {
                const videoUrl = this.getAttribute('data-video-url');
                const videoTitle = this.querySelector('.suggested-video-title').textContent;
                
                logEvent(`📌 Suggested video clicked: "${videoTitle}"`);
                
                // Remove active class from all videos
                document.querySelectorAll('.suggested-video').forEach(v => v.classList.remove('active'));
                
                // Add active class to clicked video
                this.classList.add('active');
                
                // Change the video source
                video.src = videoUrl;
                
                // Load and play the new video
                video.load();
                video.play().then(() => {
                    logEvent(`▶ Now playing: "${videoTitle}"`);
                }).catch(error => {
                    logEvent(`⚠ Error playing video: ${error.message}`);
                });
                
                // Scroll to video player
                document.querySelector('.video-player-wrapper').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            });
        });
