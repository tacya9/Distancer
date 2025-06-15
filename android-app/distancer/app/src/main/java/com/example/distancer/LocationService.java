//package com.example.distancer;
//
//import android.app.Notification;
//import android.app.NotificationChannel;
//import android.app.NotificationManager;
//import android.app.Service;
//import android.content.Intent;
//import android.os.Build;
//import android.os.IBinder;
//
//import androidx.core.app.NotificationCompat;
//
//public class LocationService extends Service {
//
//    private static final String CHANNEL_ID = "distancer_channel";
//
//    @Override
//    public void onCreate() {
//        super.onCreate();
//        createNotificationChannel(); // Создание канала уведомлений
//    }
//
//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//
//        // Уведомление, чтобы сервис работал в фоне
//        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
//                .setContentTitle("Distancer активен")
//                .setContentText("Выполняется в фоне")
//                .setSmallIcon(R.drawable.ic_notification_alert)
//                .setPriority(NotificationCompat.PRIORITY_LOW)
//                .build();
//
//        // Запуск foreground-сервиса
//        startForeground(1, notification);
//
//        // Запуск InvisibleActivity, в котором будет жить WebView с index.html
//        Intent invisibleIntent = new Intent(this, InvisibleActivity.class);
//        invisibleIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        startActivity(invisibleIntent);
//
//        return START_STICKY;
//    }
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        return null;
//    }
//
//    // Создание канала уведомлений (для Android 8+)
//    private void createNotificationChannel() {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationChannel channel = new NotificationChannel(
//                    CHANNEL_ID,
//                    "Distancer Service Channel",
//                    NotificationManager.IMPORTANCE_LOW
//            );
//            channel.setDescription("Канал для фонового сервиса Distancer");
//
//            NotificationManager manager = getSystemService(NotificationManager.class);
//            if (manager != null) {
//                manager.createNotificationChannel(channel);
//            }
//        }
//    }
//}
//
