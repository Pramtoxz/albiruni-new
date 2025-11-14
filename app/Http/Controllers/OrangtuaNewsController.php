<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrangtuaNewsController extends Controller
{
    /**
     * Display a listing of published news for orangtua.
     */
    public function index()
    {
        $news = News::where('is_published', true)
            ->orderBy('published_at', 'desc')
            ->paginate(10);

        return Inertia::render('orangtua/berita/index', [
            'news' => $news
        ]);
    }

    /**
     * Display the specified news article for orangtua.
     */
    public function show(string $slug)
    {
        $news = News::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        // Get related news (3 latest excluding current)
        $relatedNews = News::where('is_published', true)
            ->where('id', '!=', $news->id)
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();

        return Inertia::render('orangtua/berita/show', [
            'news' => $news,
            'relatedNews' => $relatedNews
        ]);
    }
}
