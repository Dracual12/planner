"use client";

import { useState } from "react";
import { Cloud, CloudOff, Bell, BellOff, Trash2 } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useNotifications } from "@/hooks/useNotifications";

export default function SettingsPage() {
  const useApi = useTaskStore((s) => s.useApi);
  const setUseApi = useTaskStore((s) => s.setUseApi);
  const tasks = useTaskStore((s) => s.tasks);
  const syncStatus = useTaskStore((s) => s.syncStatus);
  const { permission, supported, requestPermission } = useNotifications();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    useTaskStore.setState({ tasks: [] });
    setConfirmClear(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
        Настройки
      </h2>

      {/* Stats */}
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-xs font-medium uppercase text-[var(--text-secondary)]">
          Обзор
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {tasks.length}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">Всего</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--accent-neon)]">
              {pendingCount}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">В работе</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[var(--priority-low)]">
              {completedCount}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">Готово</p>
          </div>
        </div>
      </div>

      {/* Cloud Sync */}
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-xs font-medium uppercase text-[var(--text-secondary)]">
          Облачная синхронизация
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {useApi ? (
              <Cloud size={20} className="text-[var(--accent-neon)]" />
            ) : (
              <CloudOff size={20} className="text-[var(--text-muted)]" />
            )}
            <div>
              <p className="text-sm text-[var(--text-primary)]">
                {useApi ? "Подключено" : "Офлайн режим"}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {useApi
                  ? `Статус: ${syncStatus}`
                  : "Данные хранятся локально"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setUseApi(!useApi)}
            className={`relative h-7 w-12 rounded-full transition-colors ${
              useApi ? "bg-[var(--accent-neon)]" : "bg-[var(--bg-glass-heavy)]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                useApi ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
        {useApi && (
          <p className="mt-2 text-[9px] text-[var(--text-muted)]">
            Требуется DATABASE_URL в .env и работающий PostgreSQL.
          </p>
        )}
      </div>

      {/* Notifications */}
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-3 text-xs font-medium uppercase text-[var(--text-secondary)]">
          Уведомления
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {permission === "granted" ? (
              <Bell size={20} className="text-[var(--accent-neon)]" />
            ) : (
              <BellOff size={20} className="text-[var(--text-muted)]" />
            )}
            <div>
              <p className="text-sm text-[var(--text-primary)]">
                {!supported
                  ? "Не поддерживается"
                  : permission === "granted"
                    ? "Включены"
                    : permission === "denied"
                      ? "Заблокированы"
                      : "Не включены"}
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                {permission === "denied"
                  ? "Включите в настройках браузера"
                  : "Напоминания через уведомления браузера"}
              </p>
            </div>
          </div>
          {supported && permission === "default" && (
            <button
              onClick={requestPermission}
              className="rounded-lg bg-[var(--accent-neon)] px-3 py-1.5 text-xs font-medium text-white"
            >
              Включить
            </button>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass rounded-2xl border-[var(--priority-high)]/20 p-4">
        <h3 className="mb-3 text-xs font-medium uppercase text-[var(--priority-high)]">
          Опасная зона
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 size={20} className="text-[var(--priority-high)]" />
            <div>
              <p className="text-sm text-[var(--text-primary)]">
                Очистить все данные
              </p>
              <p className="text-[10px] text-[var(--text-secondary)]">
                Удалить все {tasks.length} задач из локального хранилища
              </p>
            </div>
          </div>
          <button
            onClick={handleClearData}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              confirmClear
                ? "bg-[var(--priority-high)] text-white"
                : "bg-[var(--priority-high)]/10 text-[var(--priority-high)]"
            }`}
          >
            {confirmClear ? "Подтвердить" : "Очистить"}
          </button>
        </div>
      </div>

      {/* About */}
      <div className="glass rounded-2xl p-4">
        <h3 className="mb-2 text-xs font-medium uppercase text-[var(--text-secondary)]">
          О приложении
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Планировщик PWA v1.0 — Персональный планировщик в стиле dark neon glass.
        </p>
      </div>
    </div>
  );
}
