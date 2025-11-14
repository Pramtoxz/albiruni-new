<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    private function checkAdmin()
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized - Admin access only');
        }
    }

    public function index()
    {
        $this->checkAdmin();

        $news = News::latest('created_at')->paginate(10)->withQueryString();

        return Inertia::render('admin/news/index', [
            'news' => $news,
        ]);
    }

    public function create()
    {
        $this->checkAdmin();
        return Inertia::render('admin/news/create');
    }

    public function store(Request $request)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/berita'), $filename);
            $validated['image'] = $filename;
        }

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = $validated['published_at'] ?? now();
        }

        News::create($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil ditambahkan!');
    }

    public function edit(News $news)
    {
        $this->checkAdmin();
        return Inertia::render('admin/news/edit', [
            'news' => $news,
        ]);
    }

    public function update(Request $request, News $news)
    {
        $this->checkAdmin();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image) {
                $oldPath = public_path('assets/images/berita/'.$news->image);
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }

            $file = $request->file('image');
            $filename = time().'_'.$file->getClientOriginalName();
            $file->move(public_path('assets/images/berita'), $filename);
            $validated['image'] = $filename;
        } else {
            unset($validated['image']);
        }

        if ($validated['is_published'] ?? false) {
            $validated['published_at'] = $validated['published_at'] ?? ($news->published_at ?? now());
        }

        $news->update($validated);

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil diupdate!');
    }

    public function destroy(News $news)
    {
        $this->checkAdmin();

        if ($news->image) {
            $path = public_path('assets/images/berita/'.$news->image);
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $news->delete();

        return redirect()->route('admin.news.index')->with('success', 'Berita berhasil dihapus!');
    }
}
