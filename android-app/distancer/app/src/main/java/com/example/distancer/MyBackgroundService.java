//package com.example.distancer;
//
//import android.app.Service;
//import android.app.Notification;
//import android.app.NotificationChannel;
//import android.app.NotificationManager;
//import android.content.Intent;
//import android.os.Build;
//import android.os.IBinder;
//import androidx.core.app.NotificationCompat;
//
//public class MyBackgroundService extends Service {
//    @Override
//    public void onCreate() {
//        super.onCreate();
//        startForeground(1, createNotification());
//    }
//
//    @Override
//    public int onStartCommand(Intent intent, int flags, int startId) {
//        startForeground(1, createNotification());
//        return START_STICKY;
//    }
//
//    private Notification createNotification() {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationChannel channel = new NotificationChannel(
//                    "DistancerChannel",
//                    "Background Service",
//                    NotificationManager.IMPORTANCE_LOW
//            );
//
//            NotificationManager manager = getSystemService(NotificationManager.class);
//            manager.createNotificationChannel(channel);
//        }
//
//        return new NotificationCompat.Builder(this, "DistancerChannel")
//                .setContentTitle("Приложение работает")
//                .setContentText("Следим за перемещениями...")
//                .setSmallIcon(R.mipmap.ic_launcher)
//                .setPriority(NotificationCompat.PRIORITY_LOW)
//                .build();
//    }
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        return null;
//    }
//}
