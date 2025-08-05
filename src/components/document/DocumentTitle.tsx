"use client";

import { FileText } from "lucide-react";

export default function DocumentTitle({ title }: { title: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-100 flex items-center px-8 py-6 mb-4 transition-all duration-300 hover:shadow-md hover:border-slate-200">
      <div className="flex items-center gap-4 w-full">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate leading-tight">
            {title}
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mt-2"></div>
        </div>
      </div>
    </div>
  );
}
