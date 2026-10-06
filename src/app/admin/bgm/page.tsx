"use client";

import React, { useState, useRef } from "react";
import {
  useAdminBgmTracks,
  useCreateBgm,
  useUpdateBgm,
  useDeleteBgm,
  useToggleBgm,
  BgmTrack,
} from "@/hooks/use-bgm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Music2,
  Plus,
  Play,
  Pause,
  Edit2,
  Trash2,
  Upload,
  Link as LinkIcon,
  Sparkles,
  CloudRain,
  Coffee,
  Flame,
  Disc3,
  Waves,
  Headphones,
  CheckCircle2,
  XCircle,
  Loader2,
  FileAudio,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

const ICONS_MAP: Record<string, any> = {
  Music2,
  Sparkles,
  CloudRain,
  Coffee,
  Flame,
  Disc3,
  Waves,
  Headphones,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  purple: { bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/30" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/30" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/30" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/30" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/30" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/30" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/30" },
};

export default function AdminBgmPage() {
  const { data: tracks = [], isLoading } = useAdminBgmTracks();
  const createBgmMutation = useCreateBgm();
  const updateBgmMutation = useUpdateBgm();
  const deleteBgmMutation = useDeleteBgm();
  const toggleBgmMutation = useToggleBgm();

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Preview Audio state
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPreview = (track: BgmTrack) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingTrackId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(track.audio_url);
    audio.play().catch((err) => {
      console.error(err);
      toast.error("Không thể phát thử audio: " + err.message);
      setPlayingTrackId(null);
    });

    audio.onended = () => setPlayingTrackId(null);
    audio.onerror = () => {
      toast.error("Lỗi tải file audio từ nguồn");
      setPlayingTrackId(null);
    };

    audioRef.current = audio;
    setPlayingTrackId(track.id);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState<BgmTrack | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  const [genre, setGenre] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState<"file" | "url">("file");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [iconName, setIconName] = useState("Music2");
  const [color, setColor] = useState("amber");
  const [orderIndex, setOrderIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Delete Dialog State
  const [deletingTrack, setDeletingTrack] = useState<BgmTrack | null>(null);

  const handleOpenCreateModal = () => {
    setEditingTrack(null);
    setTitle("");
    setKey("");
    setGenre("");
    setDescription("");
    setSourceType("file");
    setAudioUrl("");
    setAudioFile(null);
    setIconName("Music2");
    setColor("amber");
    setOrderIndex(tracks.length + 1);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (track: BgmTrack) => {
    setEditingTrack(track);
    setTitle(track.title);
    setKey(track.key);
    setGenre(track.genre || "");
    setDescription(track.description || "");
    setSourceType(track.audio_url.startsWith("/uploads/") ? "file" : "url");
    setAudioUrl(track.audio_url);
    setAudioFile(null);
    setIconName(track.icon_name || "Music2");
    setColor(track.color || "amber");
    setOrderIndex(track.order_index || 0);
    setIsActive(track.is_active);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bài nhạc");
      return;
    }

    if (sourceType === "file" && !audioFile && !editingTrack) {
      toast.error("Vui lòng chọn file âm thanh MP3 tải lên");
      return;
    }

    if (sourceType === "url" && !audioUrl.trim()) {
      toast.error("Vui lòng nhập đường dẫn URL âm thanh");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (key.trim()) formData.append("key", key.trim());
    if (genre.trim()) formData.append("genre", genre.trim());
    if (description.trim()) formData.append("description", description.trim());
    formData.append("icon_name", iconName);
    formData.append("color", color);
    formData.append("order_index", String(orderIndex));
    formData.append("is_active", String(isActive));

    if (sourceType === "file" && audioFile) {
      formData.append("audio_file", audioFile);
    } else if (sourceType === "url" && audioUrl) {
      formData.append("audio_url", audioUrl.trim());
    }

    try {
      if (editingTrack) {
        await updateBgmMutation.mutateAsync({ id: editingTrack.id, formData });
        toast.success("Cập nhật nhạc nền thành công!");
      } else {
        await createBgmMutation.mutateAsync(formData);
        toast.success("Thêm nhạc nền mới thành công!");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Thao tác thất bại");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTrack) return;
    try {
      if (playingTrackId === deletingTrack.id && audioRef.current) {
        audioRef.current.pause();
        setPlayingTrackId(null);
      }
      await deleteBgmMutation.mutateAsync(deletingTrack.id);
      toast.success("Đã xóa nhạc nền thành công!");
      setDeletingTrack(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Xóa thất bại");
    }
  };

  const handleToggleActive = async (track: BgmTrack) => {
    try {
      await toggleBgmMutation.mutateAsync(track.id);
      toast.success(
        `Đã ${track.is_active ? "tắt" : "bật"} kích hoạt nhạc nền "${track.title}"`
      );
    } catch (error: any) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const filteredTracks = tracks.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.genre && t.genre.toLowerCase().includes(q)) ||
      t.key.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Quản Lý Nhạc Nền Audio (BGM)
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Thêm, sửa, xóa, tải lên file MP3 và tùy biến danh mục nhạc nền đọc truyện
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenCreateModal}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs flex items-center gap-2 h-10 px-4 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm Nhạc Nền Mới
          </Button>
        </div>
      </div>

      {/* Stats and Search bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-mono">Tổng bài nhạc</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{tracks.length}</h3>
          </div>
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            <FileAudio className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-mono">Đang kích hoạt</p>
            <h3 className="text-2xl font-bold text-emerald-500 mt-1">
              {tracks.filter((t) => t.is_active).length}
            </h3>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-mono">Đang tạm tắt</p>
            <h3 className="text-2xl font-bold text-muted-foreground mt-1">
              {tracks.filter((t) => !t.is_active).length}
            </h3>
          </div>
          <div className="p-2.5 rounded-lg bg-muted text-muted-foreground">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm theo tên bài nhạc, thể loại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-card border-border text-sm"
        />
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow className="border-border">
              <TableHead className="w-12 text-center">Nghe</TableHead>
              <TableHead>Tên Bài Nhạc & Key</TableHead>
              <TableHead>Thể Loại Truyện</TableHead>
              <TableHead>Nguồn Âm Thanh</TableHead>
              <TableHead className="w-20 text-center">Thứ Tự</TableHead>
              <TableHead className="w-28 text-center">Trạng Thái</TableHead>
              <TableHead className="w-28 text-right">Thao Tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang tải danh sách nhạc nền...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTracks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                  Không tìm thấy bài nhạc nền nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredTracks.map((track) => {
                const isPlaying = playingTrackId === track.id;
                const IconComponent = ICONS_MAP[track.icon_name] || Music2;
                const colorStyle = COLOR_MAP[track.color] || COLOR_MAP.amber;

                return (
                  <TableRow key={track.id} className="border-border hover:bg-muted/30">
                    {/* Play Preview Button */}
                    <TableCell className="text-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => togglePlayPreview(track)}
                        className={`w-9 h-9 rounded-full ${
                          isPlaying
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                        title={isPlaying ? "Tạm dừng" : "Nghe thử"}
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 ml-0.5" />
                        )}
                      </Button>
                    </TableCell>

                    {/* Title & Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg border ${colorStyle.bg} ${colorStyle.text} ${colorStyle.border}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm flex items-center gap-2">
                            <span>{track.title}</span>
                            {isPlaying && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-primary font-mono animate-pulse">
                                🎵 Đang phát...
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                            Key: <span className="text-foreground/80">{track.key}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Genre */}
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-medium">
                        {track.genre || "—"}
                      </span>
                    </TableCell>

                    {/* Audio Source */}
                    <TableCell>
                      <div className="max-w-[200px] truncate text-xs font-mono text-muted-foreground">
                        {track.audio_url.startsWith("/uploads/") ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                            <Upload className="w-3 h-3" /> File tải lên
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <LinkIcon className="w-3 h-3" /> URL ngoài
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Order */}
                    <TableCell className="text-center font-mono text-xs">
                      {track.order_index}
                    </TableCell>

                    {/* Active Status */}
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleToggleActive(track)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          track.is_active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                        }`}
                      >
                        {track.is_active ? "Bật" : "Tắt"}
                      </button>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleOpenEditModal(track)}
                          className="w-8 h-8 text-muted-foreground hover:text-foreground"
                          title="Chỉnh sửa"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeletingTrack(track)}
                          className="w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Thêm / Sửa Nhạc Nền */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-xl bg-background border-border text-foreground shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Music2 className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-foreground">
                  {editingTrack ? "Chỉnh Sửa Nhạc Nền" : "Thêm Nhạc Nền Mới"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Tải lên file MP3 hoặc nhập liên kết âm thanh chất lượng cao
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
            {/* Tên bài nhạc & Key */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  Tên bài nhạc <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="VD: Lan Đình Tự (兰亭序)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-card border-border"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mã định danh (Key)</Label>
                <Input
                  placeholder="VD: landinhtu (để trống tự sinh)"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="bg-card border-border font-mono text-xs"
                />
              </div>
            </div>

            {/* Thể loại truyện */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Thể loại truyện phù hợp</Label>
              <Input
                placeholder="VD: Cổ phong, Tiên hiệp, Kiếm hiệp"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="bg-card border-border"
              />
            </div>

            {/* Mô tả ngắn */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mô tả trải nghiệm</Label>
              <Textarea
                placeholder="VD: Na Anh x Mã Gia Kỳ • Tiếng đàn tranh, sáo trúc du dương..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="bg-card border-border text-xs"
              />
            </div>

            {/* Nguồn Âm Thanh (File Upload hoặc URL) */}
            <div className="space-y-2 pt-1 border-t border-border">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <FileAudio className="w-4 h-4 text-primary" /> Nguồn Âm Thanh MP3
              </Label>

              <Tabs
                value={sourceType}
                onValueChange={(v: any) => setSourceType(v)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 bg-muted p-1 border border-border">
                  <TabsTrigger value="file" className="text-xs flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Tải file MP3 lên
                  </TabsTrigger>
                  <TabsTrigger value="url" className="text-xs flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5" /> Nhập URL Audio trực tiếp
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="pt-3 space-y-2">
                  <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-4 text-center transition-colors bg-muted/20">
                    <input
                      type="file"
                      id="bgm-file-upload"
                      accept="audio/mp3,audio/mpeg,audio/wav,audio/m4a,audio/aac,audio/ogg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setAudioFile(file);
                      }}
                    />
                    <label
                      htmlFor="bgm-file-upload"
                      className="cursor-pointer flex flex-col items-center justify-center gap-2"
                    >
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs">
                        {audioFile ? (
                          <span className="font-semibold text-primary">
                            Đã chọn: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        ) : (
                          <span>
                            <span className="font-semibold text-primary">Nhấn để chọn file MP3</span> hoặc kéo thả vào đây
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Hỗ trợ MP3, WAV, M4A, AAC (Tối đa 50MB)
                      </span>
                    </label>
                  </div>
                  {editingTrack && editingTrack.audio_url.startsWith("/uploads/") && !audioFile && (
                    <p className="text-[11px] text-muted-foreground font-mono">
                      File hiện tại: {editingTrack.audio_url}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="url" className="pt-3 space-y-2">
                  <Input
                    placeholder="https://example.com/audio/song.mp3 hoặc CDN link"
                    value={audioUrl}
                    onChange={(e) => setAudioUrl(e.target.value)}
                    className="bg-card border-border font-mono text-xs"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    * Hỗ trợ liên kết trực tiếp tới file âm thanh (`.mp3`, `.wav`, `.m4a`...).
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            {/* Icon & Màu sắc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
              {/* Chọn Icon */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Icon Biểu Tượng</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.keys(ICONS_MAP).map((iconKey) => {
                    const IconComp = ICONS_MAP[iconKey];
                    const isSelected = iconName === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setIconName(iconKey)}
                        className={`p-2 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                            : "border-border bg-card hover:bg-muted text-muted-foreground"
                        }`}
                        title={iconKey}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chọn Màu Sắc */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tông Màu</Label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.keys(COLOR_MAP).map((cKey) => {
                    const cStyle = COLOR_MAP[cKey];
                    const isSelected = color === cKey;
                    return (
                      <button
                        type="button"
                        key={cKey}
                        onClick={() => setColor(cKey)}
                        className={`p-2 rounded-lg border text-xs capitalize transition-all cursor-pointer font-medium ${cStyle.bg} ${cStyle.text} ${
                          isSelected
                            ? `${cStyle.border} ring-2 ring-primary`
                            : "border-border hover:opacity-80"
                        }`}
                      >
                        {cKey}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Thứ tự & Trạng thái */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Thứ tự hiển thị (Order)</Label>
                <Input
                  type="number"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(Number(e.target.value))}
                  className="bg-card border-border font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <Label className="text-xs font-semibold mb-2">Trạng thái phát</Label>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="font-medium text-foreground">
                    Kích hoạt cho độc giả sử dụng
                  </span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-border flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={createBgmMutation.isPending || updateBgmMutation.isPending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              >
                {(createBgmMutation.isPending || updateBgmMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingTrack ? "Lưu Thay Đổi" : "Tạo Nhạc Nền"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Xác Nhận Xóa */}
      <Dialog open={!!deletingTrack} onOpenChange={(open) => !open && setDeletingTrack(null)}>
        <DialogContent className="sm:max-w-md bg-background border-border text-foreground shadow-2xl p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg font-bold text-red-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Xác Nhận Xóa Nhạc Nền
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Bạn có chắc chắn muốn xóa bài nhạc nền <strong>"{deletingTrack?.title}"</strong>? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingTrack(null)}
              className="border-border text-foreground hover:bg-muted"
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteBgmMutation.isPending}
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              {deleteBgmMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Xác Nhận Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
