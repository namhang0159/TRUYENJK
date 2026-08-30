import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChapterVersions } from '@/hooks/use-author';
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { History, Eye, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VersionsModalProps {
  chapterId: string | number;
  isOpen: boolean;
  onClose: () => void;
  onRestorePreview?: (content: string) => void;
}

export function VersionsModal({ chapterId, isOpen, onClose, onRestorePreview }: VersionsModalProps) {
  const { data: versions, isLoading } = useChapterVersions(chapterId);
  const [selectedVersion, setSelectedVersion] = React.useState<any>(null);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Lịch sử Phiên bản
          </DialogTitle>
          <DialogDescription>
            Xem lại các thay đổi cũ của chương truyện.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden gap-4 mt-4">
          {/* List Versions */}
          <div className="w-1/3 border-r pr-4 flex flex-col">
            <h4 className="font-semibold mb-2">Các phiên bản đã lưu</h4>
            <ScrollArea className="flex-1">
              {isLoading ? (
                <div className="text-sm text-gray-500">Đang tải...</div>
              ) : versions?.length === 0 ? (
                <div className="text-sm text-gray-500">Chưa có lịch sử phiên bản nào.</div>
              ) : (
                <div className="space-y-2 pr-4">
                  {versions?.map((v: any, index: number) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v)}
                      className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                        selectedVersion?.id === v.id 
                          ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' 
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-900">
                          {index === 0 ? "Bản gần nhất" : `Bản #${versions.length - index}`}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(v.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                      </div>
                      <div className="mt-2 text-xs truncate text-gray-600">
                        {v.title}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Preview Version */}
          <div className="w-2/3 flex flex-col pl-2">
            {!selectedVersion ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <Eye className="w-12 h-12 mb-2 opacity-50" />
                <p>Chọn một phiên bản bên trái để xem trước nội dung</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">{selectedVersion.title}</h4>
                    <span className="text-sm text-gray-500">
                      Lưu lúc: {format(new Date(selectedVersion.created_at), "HH:mm, dd/MM/yyyy", { locale: vi })}
                    </span>
                  </div>
                  {onRestorePreview && (
                    <Button 
                      variant="outline" 
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={() => {
                        onRestorePreview(selectedVersion.text_content || selectedVersion.content || "");
                        onClose();
                      }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Sử dụng bản này
                    </Button>
                  )}
                </div>
                <ScrollArea className="flex-1 border rounded-md p-4 bg-gray-50">
                  <div 
                    className="prose prose-sm max-w-none" 
                    dangerouslySetInnerHTML={{ __html: selectedVersion.text_content || selectedVersion.content || "<i>Không có nội dung</i>" }} 
                  />
                </ScrollArea>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
