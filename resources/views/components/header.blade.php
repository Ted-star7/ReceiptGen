<div class="header">
    <div style="display:flex;align-items:center;gap:16px;">
        <button class="menu-toggle" onclick="toggleSidebar()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
        </button>
        <h1><a href="/" style="color:white;text-decoration:none;">Receipt Builder</a> 
            {{-- <span style="font-size:11px;font-weight:400;opacity:0.8;">by Anzar KE</span></h1> --}}
    </div>
    <div class="header-actions">
        @auth
            <div class="user-dropdown">
                <button class="user-btn" onclick="toggleUserMenu()">
                    <span class="user-avatar">{{ strtoupper(substr(auth()->user()->name, 0, 1)) }}</span>
                    {{ auth()->user()->name }} ▼
                </button>
                <div class="user-menu" id="userMenu">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/profile">Profile</a>
                    <form action="/logout" method="POST" style="margin:0;">
                        @csrf
                        <button type="submit" style="width:100%;text-align:left;background:none;border:none;padding:8px 12px;cursor:pointer;font-size:13px;">Logout</button>
                    </form>
                </div>
            </div>
        @else
            <a href="/login" class="header-btn">Login</a>
        @endauth
    </div>
</div>

<style>
.menu-toggle { display: none; background: none; border: none; color: white; cursor: pointer; padding: 4px; }
.user-dropdown { position: relative; }
.user-btn { background: rgba(255,255,255,0.2); color: white; border: none; padding: 8px 16px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.user-btn:hover { background: rgba(255,255,255,0.3); }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; background: white; color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; }
.user-menu { display: none; position: absolute; right: 0; top: 100%; margin-top: 8px; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); min-width: 150px; z-index: 1000; }
.user-menu a { display: block; padding: 8px 12px; color: var(--text-main); text-decoration: none; font-size: 13px; }
.user-menu a:hover, .user-menu button:hover { background: #f5f5f5; }
.user-menu.show { display: block; }

@media (max-width: 1024px) {
    .menu-toggle { display: block; }
}
</style>

<script>
function toggleSidebar() {
    document.getElementById('sidebar')?.classList.toggle('show');
    document.getElementById('controls')?.classList.toggle('show');
}

function toggleUserMenu() {
    document.getElementById('userMenu').classList.toggle('show');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
        document.getElementById('userMenu')?.classList.remove('show');
    }
    if (!e.target.closest('.menu-toggle') && !e.target.closest('.sidebar') && !e.target.closest('#controls')) {
        document.getElementById('sidebar')?.classList.remove('show');
        document.getElementById('controls')?.classList.remove('show');
    }
});
</script>
